import { createStore } from 'redux';
import { throttle } from 'lodash';

/* ==========================================================================
   Local storage helpers
   ========================================================================== */

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};


export const saveState = (state: iCounterState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};

/* ==========================================================================
   Types
   ========================================================================== */

export type CounterId = string;

export interface iCounterUpdateMessageTemplate {
  (newValue: number, oldValue: number): (JSX.Element | string | undefined | null);
}

export interface iCounter {
  id: string;
  value: number;
  updateMessageTemplate: Function;
}

export interface HistoryEntry {
  oldValue: number;
  newValue: number;
  counterId: string;
}

export interface iCounterState {
  counters: iCounter[];
  history: HistoryEntry[];
  difference_container: {
    difference: number;
    counterId: string;
  };
}

export interface iCountersAction {
  type: CounterActionType;
  payload: iCounter;
}

export interface iCountersActionAddHistory {
  type: CounterActionType.ADD_HISTORY;
  payload: iCounterState['history'];
}

export enum CounterActionType {
  ADD_COUNTER = 'ADD_COUNTER',
  UPDATE_COUNTER = 'UPDATE_COUNTER',
  REMOVE_COUNTER = 'REMOVE_COUNTER',
  ADD_HISTORY = 'ADD_HISTORY',
}

type SFA<T, P> = { type: T, payload: P };

const createAction = <T extends CounterActionType, P>(
  type: T,
  payload: P
) : SFA<T, P> => ({ type, payload });


/* ==========================================================================
   Action creators
   ========================================================================== */


export const updateCounter = (payload: iCounter) =>
  createAction(CounterActionType.UPDATE_COUNTER, payload);

export const removeCounter = (payload: iCounter) =>
  createAction(CounterActionType.REMOVE_COUNTER, payload);

export const addHistory = (payload: iCounterState['history']) =>
  createAction(CounterActionType.ADD_HISTORY, payload);

const actions = { updateCounter, removeCounter, addHistory };
type Action = ReturnType<typeof actions[keyof typeof actions]>;


/* ==========================================================================
   Selectors
   ========================================================================== */

export function getCounters(state: iCounterState): iCounter[] {
  return state.counters;
}

export function getCounterById(state: iCounterState, id: string) {
  return getCounters(state).find(counter => counter.id === id);
}

export function aggregateCountersSelector(state: iCounterState): number {
  return state.counters.reduce((accumulator, current) => {
    return accumulator + current.value;
  }, 0);
}

export function getHistory(state: iCounterState): iCounterState['history'] {
  return state.history;
}

export function getDifference(state: iCounterState): iCounterState['difference_container'] {
  return state.difference_container;
}


/* ==========================================================================
   Store
   ========================================================================== */


const countersHistoryLimit = 30;

function counters(
  state: iCounterState = {
    counters: [],
    history: [],
    difference_container: {
      difference: 0,
      counterId: ''
    }
  },
  action: Action
) : iCounterState {
  switch (action.type) {
    case CounterActionType.REMOVE_COUNTER:
      return {
        ...state,
        counters: state.counters.filter(counter => action.payload.id !== counter.id)
      }
    case CounterActionType.UPDATE_COUNTER:
      let existingCounter = state.counters
        .find(counter => counter.id === action.payload.id);
      const newCounter = action.payload;
      return existingCounter
        /**
         * If a counter with this ID already exists in the store,
         * update the value of this counter.
         */
        ? {
          ...state,
          counters: state.counters.map(counter => {
            return counter.id === action.payload.id
              ? { ...counter, value: action.payload.value }
              : counter;
          }),
          history: [
            {
              newValue: newCounter.value,
              oldValue: existingCounter.value,
              counterId: newCounter.id
            },
            ...state.history
          ].slice(0, countersHistoryLimit - 1),
          /**
           * Store the difference between the previous value and the new value.
           * So we know, how many candies have been added / removed. (e.g. -2 or 1)
           * Use a container to store the number. This way, we make sure that an update
           * is always triggered, even if the previous difference and the new difference
           * are the same. e.g:
           * difference: -1
           * difference: -1
           * difference: -1
           */
          difference_container: {
            difference: newCounter.value - existingCounter.value,
            counterId: action.payload.id
          }

        }
        /**
         * If there is no counter with this ID yet, just add the
         * new counter to the store.
         */
        : {
          ...state,
          counters: [...state.counters, newCounter]
        };
    case CounterActionType.ADD_HISTORY:
      return {
        ...state,
        history: action.payload
      }
    default:
      return state;
  }
}

const persistedStore = loadState();

// For redux dev tools
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: Function
  }
}

export const store = createStore(
  counters,
  persistedStore,
  // For redux dev tools
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(throttle(() => {
  saveState(store.getState());
}, 1000))
