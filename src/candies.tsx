import React from 'react';
import { iCounter } from './store';

export interface SingularPluralString {
  singular: string;
  plural: string;
}

export interface Candy {
  name: SingularPluralString;
  color: string;
}

export interface CandyCounter extends iCounter {
  name: SingularPluralString;
  color: string;
}

export const candyCounterCreator = (candy: Candy, counter: iCounter): CandyCounter => {
  return {
    ...candy,
    id: counter.id,
    value: counter.value,
    updateMessageTemplate: (newValue: number, oldValue: number) => {
      const difference = newValue - oldValue;
      if (difference > 0) {
        return (
          <span>
            <span role="img" aria-label="Candy icon">🍬 </span>
            +{difference} {difference === 1
              ? <span style={{ color: candy.color || '' }}>{candy.name.singular}</span>
              : <span style={{ color: candy.color || '' }}>{candy.name.plural}</span>} added
          </span>
        );
      } else if (difference < 0) {
        return (
          <span>
            <span role="img" aria-label="Candy icon">🍬 </span>
            -{Math.abs(difference)} {Math.abs(difference) === 1
              ? <span style={{ color: candy.color || '' }}>{candy.name.singular}</span>
              :<span style={{ color: candy.color || '' }}>{candy.name.plural}</span>} removed
          </span>
        );
      }
      return null;
    }
  }
}

export const blueBubbleGums : Candy = {
  name: {
    singular: 'Blue bubble gum',
    plural: 'Blue bubble gums'
  },
  color: '#5555ff'
}

export const greenBubbleGums : Candy = {
  name: {
    singular: 'Green bubble gum',
    plural: 'Green bubble gums'
  },
  color: '#55ff55'
}

export const redCandies : Candy = {
  name: {
    singular: 'Red candy',
    plural: 'Red candies'
  },
  color: '#ff3333'
}


export const blueBubbleGumsCounter = candyCounterCreator({
  name: {
    singular: 'Blue bubble gum',
    plural: 'Blue bubble gums'
  },
  color: '#5555ff'
}, {
  id: "1",
  value: 0,
  updateMessageTemplate: () => {}
});

export const greenBubbleGumsCounter = candyCounterCreator({
  name: {
    singular: 'Green bubble gum',
    plural: 'Green bubble gums'
  },
  color: '#55ff55'
}, {
  id: "2",
  value: 0,
  updateMessageTemplate: () => {}
});

export const redCandiesCounter = candyCounterCreator({
  name: {
    singular: 'Red candy',
    plural: 'Red candies'
  },
  color: '#ff3333'
}, {
  id: "3",
  value: 0,
  updateMessageTemplate: () => {}
});

export const candyCounters = [
  blueBubbleGumsCounter,
  greenBubbleGumsCounter,
  redCandiesCounter
];

export function getCandyCountersById(id: string, candyCounters: CandyCounter[]): (CandyCounter | undefined) {
  return candyCounters.find(counter => counter.id === id);
}
