import React from 'react';
import ReactDOM from 'react-dom';
import { arc } from 'd3-shape';
import './index.css';

const Gauge = ({
  value = 50,
  min = 0,
  max = 100,
  label,
  units
}) => {
  const backgroundArc = arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .cornerRadius(1);

  // Note: This is the solution I came up with.
  // The tutorial uses the `scaleLinear` function from d3 to calculate the angle.
  const valueEndAngle =
    (-Math.PI / 2) + (Math.PI / (max - min) * value);

  const valueArc = arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(valueEndAngle)
    .cornerRadius(1);

  return (
    <div>
      <svg
        width="9em"
        viewBox={[
          -1, // x
          -1, // y
          2,  // width
          2   // height
        ].join(' ')}
        style={{
          border: "1px solid pink"
        }}>
        <path
          d={backgroundArc()}
          fill="#dbdbe7">
        </path>
        <path
          d={valueArc()}
          fill="#ffdbe7">
        </path>
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
