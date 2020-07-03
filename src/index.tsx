import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { GaugeWithSliderRedux } from './components/gaugewithslider/gaugewithslider';
import { InfoBoardRedux } from './components/infoboard/infoboard';
import { store } from './store';
import 'rc-slider/assets/index.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <h1 className="title">Bubble gums control center</h1>
      <GaugeWithSliderRedux
        value={0}
        max={2000}
        label="Bubble gums"
        units="Quantity"
        componentId="1"
        colspan={3} />
      <GaugeWithSliderRedux
        value={40}
        label="Bubble gums"
        units="Quantity"
        componentId="2"
        colspan={3} />
      <GaugeWithSliderRedux
        label="Bubble gums"
        value={70}
        units="Quantity"
        componentId="3"
        colspan={3} />
      <InfoBoardRedux />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
