import React, { } from 'react';
import ReactDOM from 'react-dom';
import { GaugeWithSlider } from './components/gaugewithslider/gaugewithslider';
import 'rc-slider/assets/index.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <h1 className="title">Gauge control center</h1>
    <GaugeWithSlider
      value={0}
      max={2000}
      label="Atmospheric Pressure"
      units="hectopascals"
      componentId="1"
      colspan={3} />
    <GaugeWithSlider
      value={40}
      label="Wind speed"
      units="meters per second"
      componentId="2"
      colspan={3} />
    <GaugeWithSlider
      label="Kilometers driven"
      value={70}
      units="kilometers"
      componentId="3"
      colspan={3} />
  </React.StrictMode>,
  document.getElementById('root')
);
