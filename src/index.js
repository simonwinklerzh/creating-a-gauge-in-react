import React from 'react';
import ReactDOM from 'react-dom';
import { arc } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
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

  const colorScale = scaleLinear()
    .domain([0, 1])
    .range(['#dbdbe7', '#4834d4']);

  const gradientSteps = colorScale
    .ticks(10) // Create 10 even steps between 0 and 1 (see `.domain([0, 1])`)
    .map(colorScale); // Map numeric values to color values between `.range(['#dbdbe7', '#4834d4'])`

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
        <defs>
          <linearGradient
            id="gauge-gradient"
            gradientUnits="userSpaceOnUse"
            x1="-1"
            x2="1"
            y2="0">
              {
                gradientSteps
                  .map((color, index) => (
                    <stop
                      key={index}
                      stopColor={color}
                      offset={`${index / (gradientSteps.length - 1)}`}>
                    </stop>
                  ))
              }
          </linearGradient>
        </defs>
        <path
          d={backgroundArc()}
          fill="#dbdbe7">
        </path>
        <path
          d={valueArc()}
          fill="url(#gauge-gradient)">
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
