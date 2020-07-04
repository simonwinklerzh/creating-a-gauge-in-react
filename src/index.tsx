import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { GaugeWithSliderRedux } from './components/gaugewithslider/gaugewithslider';
import { InfoBoardRedux } from './components/infoboard/infoboard';
import { store } from './store';
import 'rc-slider/assets/index.css';
import './index.css';

export interface SingularPluralString {
  singular: string;
  plural: string;
}

export interface Candy {
  name: SingularPluralString;
  color: string;
}

const blueBubbleGums : Candy = {
  name: {
    singular: 'Blue bubble gum',
    plural: 'Blue bubble gums'
  },
  color: '#5555ff'
}

const greenBubbleGums : Candy = {
  name: {
    singular: 'Green bubble gum',
    plural: 'Green bubble gums'
  },
  color: '#55ff55'
}

const redCandies : Candy = {
  name: {
    singular: 'Red candy',
    plural: 'Red candies'
  },
  color: '#ff3333'
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <h1 className="title">
        <span
          role="img"
          aria-label="Candy icon"
          className="title__icon">🍬&nbsp;</span>
        Candy control center</h1>
      <GaugeWithSliderRedux
        value={0}
        max={2000}
        label={blueBubbleGums.name.singular}
        singularPluralLabel={blueBubbleGums.name}
        color={blueBubbleGums.color}
        units="Quantity"
        componentId="1"
        colspan={3} />
      <GaugeWithSliderRedux
        value={40}
        label={greenBubbleGums.name.singular}
        singularPluralLabel={greenBubbleGums.name}
        color={greenBubbleGums.color}
        units="Quantity"
        componentId="2"
        colspan={3} />
      <GaugeWithSliderRedux
        label={redCandies.name.singular}
        singularPluralLabel={redCandies.name}
        color={redCandies.color}
        value={70}
        units="Quantity"
        componentId="3"
        colspan={3} />
      <InfoBoardRedux
        title="Total number of candies"
        subTitle="Candies change history:" />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
