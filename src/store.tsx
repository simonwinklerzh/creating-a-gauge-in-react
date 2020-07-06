import { createStore } from 'redux';

export type CounterId = string;

export interface iCounterUpdateMessageTemplate {
  (newValue: number, oldValue: number): (JSX.Element | string | undefined | null);
}

export interface iCounter {
  id: string;
  value: number;
  updateMessageTemplate: Function;
}

export interface iCounterState {
  counters: iCounter[];
  history: string[];
  difference_container: {
    difference: number;
    counterId: string;
  };
}

export interface iCountersAction {
  type: CounterActionType;
  payload: iCounter;
}

export enum CounterActionType {
  ADD_COUNTER,
  UPDATE_COUNTER,
  REMOVE_COUNTER,
  DEFAULT
}


/* ==========================================================================
   Action creators
   ========================================================================== */


export function updateCounter(counter: iCounter): iCountersAction {
  return {
    type: CounterActionType.UPDATE_COUNTER,
    payload: counter
  }
}

export function removeCounter(counter: iCounter): iCountersAction {
  return {
    type: CounterActionType.REMOVE_COUNTER,
    payload: counter
  }
}


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
  action: iCountersAction
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
          history: newCounter.updateMessageTemplate
            ? [
              newCounter.updateMessageTemplate(newCounter.value, existingCounter.value),
              ...state.history
            ].slice(0, countersHistoryLimit - 1)
            : state.history,
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
      // return state;
    default:
      return state;
  }
}

// For redux dev tools
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: Function
  }
}

export const store = createStore(
  counters,
  // For redux dev tools
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
