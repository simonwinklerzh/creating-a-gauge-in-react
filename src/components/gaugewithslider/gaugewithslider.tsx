import React from 'react';
import Slider from 'rc-slider';
import { Gauge } from '../gauge/gauge';
import { useLocalStorage } from '../../hooks';

export const GaugeWithSlider = ({
  value = 60,
  min = 0,
  max = 200,
  label = "Speed",
  units = "kilometers per hour",
  componentId = '' // Provide a component ID if you want to persist the state to local storage
} = {}) => {
  const [ valueState, setValuestate ] = useLocalStorage(`gauge_control_center_state_${componentId}`, value);

  if (!componentId) {
    console.error('You must provide a (unique persistent) id for this component to work properly');
    return null;
  }

  return (
    <div className="gauge-container">
      <Gauge {...{
        value: valueState,
        min,
        max,
        label,
        units
      }} />
      <div className="gauge__slider">
        <Slider {...{
          value: valueState,
          min,
          max,
          marks: {[min]: String(min), [max]: String(max)},
          onChange: setValuestate
        }} />
      </div>
    </div>
  );
};
