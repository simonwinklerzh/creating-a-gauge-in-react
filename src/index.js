import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Gauge = ({
  value = 50,
  min = 0,
  max = 100,
  label,
  units
}) => {
  return (
    <div>
      <svg
        width="9em"
        viewBox={[
          -1, // x
          -1, // y
          2,  // width
          1   // height
        ]}
        style={{
          border: "1px solid pink"
        }}>
      </svg>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Gauge />
  </React.StrictMode>,
  document.getElementById('root')
);
