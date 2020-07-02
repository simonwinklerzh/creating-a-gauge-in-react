import React, { } from 'react';
import ReactDOM from 'react-dom';
import { GaugeWithSlider } from './components/gaugewithslider/gaugewithslider';
import { InformationBoard } from './components/infoboard/infoboard';
import 'rc-slider/assets/index.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <h1 className="title">Bubble gums control center</h1>
    <GaugeWithSlider
      value={0}
      max={2000}
      label="Bubble gums"
      units="Quantity"
      componentId="1"
      colspan={3} />
    <GaugeWithSlider
      value={40}
      label="Bubble gums"
      units="Quantity"
      componentId="2"
      colspan={3} />
    <GaugeWithSlider
      label="Bubble gums"
      value={70}
      units="Quantity"
      componentId="3"
      colspan={3} />
  </React.StrictMode>,
  document.getElementById('root')
);
