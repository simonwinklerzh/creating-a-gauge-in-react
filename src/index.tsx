import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { GaugeWithSliderRedux } from './components/gaugewithslider/gaugewithslider';
import { InfoBoardRedux } from './components/infoboard/infoboard';
import { CandyCanvas } from './components/candycanvas/candycanvas';
import { store } from './store';
import { candyCounterCreator } from './candies';
import 'rc-slider/assets/index.css';
import './index.css';


const blueBubbleGumsCounter = candyCounterCreator({
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

const greenBubbleGumsCounter = candyCounterCreator({
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

const redCandiesCounter = candyCounterCreator({
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
        units="Quantity"
        componentId="1"
        colspan={3}
        candyCounter={blueBubbleGumsCounter} />
      <GaugeWithSliderRedux
        value={40}
        units="Quantity"
        componentId="2"
        colspan={3}
        candyCounter={greenBubbleGumsCounter} />
      <GaugeWithSliderRedux
        value={70}
        units="Quantity"
        componentId="3"
        colspan={3}
        candyCounter={redCandiesCounter} />
      <InfoBoardRedux
        title="Total number of candies"
        subTitle="Candies change history:" />
      <CandyCanvas />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
