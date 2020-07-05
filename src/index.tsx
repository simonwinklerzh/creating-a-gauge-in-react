import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { GaugeWithSliderRedux } from './components/gaugewithslider/gaugewithslider';
import { InfoBoardRedux } from './components/infoboard/infoboard';
import { CandyCanvas } from './components/candycanvas/candycanvas';
import { store } from './store';
import { blueBubbleGums, greenBubbleGums, redCandies } from './candies';
import 'rc-slider/assets/index.css';
import './index.css';

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
        max={100}
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
      <CandyCanvas />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
