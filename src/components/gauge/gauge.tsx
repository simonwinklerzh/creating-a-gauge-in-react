import React from 'react';
import { arc } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { format } from 'd3-format';

// Helper function
const getCoordsOnArc = (angle: number, offset=10) => [
  Math.cos(angle - (Math.PI / 2)) * offset,
  Math.sin(angle - (Math.PI / 2)) * offset,
];

export interface iGauge {
  readonly value?: number;
  readonly min?: number;
  readonly max?: number;
  readonly label?: string;
  readonly units?: string;
}

export const Gauge = ({
  value = 50,
  min = 0,
  max = 100,
  units,
  label
}: iGauge) => {
  const backgroundArc = arc()
  .cornerRadius(1)({
    innerRadius: 0.65,
    outerRadius: 1,
    startAngle: -Math.PI / 2,
    endAngle: Math.PI / 2
  });

  const percentScale = scaleLinear()
    .domain([min, max])
    .range([0, 1]);

  const percent = percentScale(value);

  const angleScale = scaleLinear()
    .domain([0, 1])
    .range([-Math.PI / 2, Math.PI / 2])
    .clamp(true);

  const valueEndAngle = angleScale(percent);

  const valueArc = arc()
    .cornerRadius(1)({
      innerRadius: 0.65,
      outerRadius: 1,
      startAngle: -Math.PI / 2,
      endAngle: valueEndAngle
    });

  const colorScale = scaleLinear<string>()
    .domain([0, 1])
    .range(['#dbdbe7', '#4834d4']);

  const gradientSteps = colorScale
    .ticks(10) // Create 10 even steps between 0 and 1 (see `.domain([0, 1])`)
    .map(colorScale); // Map numeric values to color values between `.range(['#dbdbe7', '#4834d4'])`

  const markerLocation = getCoordsOnArc(
    valueEndAngle,
    1 - ((1 - 0.65) / 2)
  );

  return (
    <div
      className='gauge'>
      <svg
        className='gauge__svg-element'
        width="9em"
        viewBox={[
          -1, // x
          -1, // y
          2,  // width
          1   // height
        ].join(' ')}>
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
        {!!backgroundArc && (
          <path
            d={backgroundArc}
            fill="#dbdbe7">
          </path>
        )}
        {!!valueArc && (
          <path
            d={valueArc}
            fill="url(#gauge-gradient)">
          </path>
        )}
        <line
          y1="-1"
          y2="-0.65"
          stroke="#ffffff"
          strokeWidth="0.027"></line>
        <circle
          cx={markerLocation[0]}
          cy={markerLocation[1]}
          r="0.2"
          stroke="#2c3e50"
          strokeWidth="0.01"
          fill={colorScale(percent)}>
        </circle>
        <path
          d="M0.136364 0.0290102C0.158279 -0.0096701 0.219156 -0.00967009 0.241071 0.0290102C0.297078 0.120023 0.375 0.263367 0.375 0.324801C0.375 0.422639 0.292208 0.5 0.1875 0.5C0.0852272 0.5 -1.8346e-08 0.422639 -9.79274e-09 0.324801C0.00243506 0.263367 0.0803571 0.120023 0.136364 0.0290102ZM0.1875 0.381684C0.221591 0.381684 0.248377 0.356655 0.248377 0.324801C0.248377 0.292947 0.221591 0.267918 0.1875 0.267918C0.153409 0.267918 0.126623 0.292947 0.126623 0.324801C0.126623 0.356655 0.155844 0.381684 0.1875 0.381684Z"
          transform={`rotate(${
            valueEndAngle * (180 / Math.PI)
          }) translate(-0.2, -0.33)`}
          fill="#6a6a85"
        />
      </svg>
      <div className="gauge__value">
        { format(",")(value) }
      </div>
      {!!label && (
        <div className='gauge__label'>
          { label }
        </div>
      )}
      {!!units && (
        <div className='gauge__unit'>
          { units }
        </div>
      )}
    </div>
  );
}
