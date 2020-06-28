import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
import { Gauge } from './components/gauge/gauge';
import 'rc-slider/assets/index.css';
import './index.css';

const GaugeWithSlider = ({
  value = 60,
  min = 0,
  max = 200,
  label = "Speed",
  units = "kilometers per hour"
} = {}) => {
  const [ valueState, setValuestate ] = useState(value);

  return (
    <div className="gauge-container">
      <Gauge {...{
        value: valueState,
        min,
        max,
        label,
        units
      }} />
      <div class="gauge__slider">
        <Slider {...{
          value: valueState,
          min,
          max,
          marks: {[min]: min, [max]: max},
          onChange: setValuestate
        }} />
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <h1 class="title">Gauge control center</h1>
    <GaugeWithSlider
      value={0}
      max={2000}
      label="Atmospheric Pressure"
      units="hectopascals" />
    <GaugeWithSlider
      value={40}
      label="Wind speed"
      units="meters per second" />
    <GaugeWithSlider
      label="Kilometers driven"
      value={70}
      units="kilometers" />
  </React.StrictMode>,
  document.getElementById('root')
);
