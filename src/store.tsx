import { createStore } from 'redux';

export type CounterId = string;

export interface iCounter {
  id: string,
  value: number
}

export interface iCounterState {
  counters: iCounter[];
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

export function aggregateCountersSelector(state: iCounterState): number {
  return state.counters.reduce((accumulator, current) => {
    return accumulator + current.value;
  }, 0);
}

function counters(
  state: iCounterState = { counters: [] },
  action: iCountersAction
) : iCounterState {
  switch (action.type) {
    case CounterActionType.REMOVE_COUNTER:
      return {
        ...state,
        counters: state.counters.filter(counter => action.payload.id !== counter.id)
      }
    case CounterActionType.UPDATE_COUNTER:
      let newCounters =
        state.counters.find(counter => counter.id === action.payload.id)
          ? state.counters
          : [...state.counters, action.payload];
      return {
        ...state,
        counters: newCounters.map(counter => {
          if (counter.id === action.payload.id) {
            counter.value = action.payload.value;
          }
          return counter;
        })
      }
    default:
      return state;
  }
}

export const store = createStore(counters);

// const unsubscript = store.subscribe()
