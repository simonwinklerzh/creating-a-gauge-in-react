import React from 'react';
import ReactDOM from 'react-dom';
import { Gauge } from './components/gauge/gauge';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <div style={{marginBottom: '1em'}}>
      <Gauge
        value="100"
        label="Atmospheric Pressure"
        units="hectopascals" />
    </div>
    <div style={{marginBottom: '1em'}}>
      <Gauge
        value={40}
        label="Wind speed"
        units="meters per second" />
    </div>
    <div style={{marginBottom: '1em'}}>
      <Gauge
        label="Kilometers driven"
        value={70}
        units="kilometers" />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
