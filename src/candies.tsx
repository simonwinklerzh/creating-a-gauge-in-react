export interface SingularPluralString {
  singular: string;
  plural: string;
}

export interface Candy {
  name: SingularPluralString;
  color: string;
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
