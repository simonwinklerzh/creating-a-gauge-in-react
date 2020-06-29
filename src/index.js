import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
import { Gauge } from './components/gauge/gauge';
import 'rc-slider/assets/index.css';
import './index.css';

// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const GaugeWithSlider = ({
  value = 60,
  min = 0,
  max = 200,
  label = "Speed",
  units = "kilometers per hour",
  componentId // Provide a component ID if you want to persist the state to local storage
} = {}) => {
  const [ valueState, setValuestate ] = useLocalStorage(`gauge_control_center_state_${componentId}`, value);

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
          marks: {[min]: min, [max]: max},
          onChange: setValuestate
        }} />
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <h1 className="title">Gauge control center</h1>
    <GaugeWithSlider
      value={0}
      max={2000}
      label="Atmospheric Pressure"
      units="hectopascals"
      componentId="1" />
    <GaugeWithSlider
      value={40}
      label="Wind speed"
      units="meters per second"
      componentId="2" />
    <GaugeWithSlider
      label="Kilometers driven"
      value={70}
      units="kilometers"
      componentId="3" />
    <GaugeWithSlider
      label="Kilometers driven"
      value={70}
      units="kilometers"
      componentId="3" />
    <GaugeWithSlider
      label="Kilometers driven"
      value={70}
      units="kilometers" />
  </React.StrictMode>,
  document.getElementById('root')
);
