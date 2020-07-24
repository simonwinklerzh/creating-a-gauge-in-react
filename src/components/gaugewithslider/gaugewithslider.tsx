import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'rc-slider';
import { Gauge, iGauge } from '../gauge/gauge';
import {
  updateCounter,
  getCounterById,
  iCounter,
  iCounterState
} from '../../store';
import { CandyCounter } from '../../candies';

export interface iGaugeWithSlider extends iGauge {
  colspan?: number;
  value: number;
  setValue?: (value: number) => void;
}

export interface iGaugeWithSliderRedux extends iGaugeWithSlider {
  componentId: string;
  candyCounter: CandyCounter;
}

export const GaugeWithSlider = ({
  value = 60,
  setValue = (n: number) => {},
  min = 0,
  max = 200,
  label = "Speed",
  color,
  units = "kilometers per hour",
  colspan = 1,
  id
}: iGaugeWithSlider) => {
  return (
    <div
      className="gaugewithslider"
      style={{
        gridColumnStart: `span ${colspan}`
      }}>
      <Gauge {...{
        value,
        min,
        max,
        label,
        units,
        color,
        id
      }} />
      <div className="gaugewithslider__slider">
        <Slider {...{
          value,
          min,
          max,
          marks: {[min]: String(min), [max]: String(max)},
          onChange: setValue,
          trackStyle: {
            backgroundColor: '#1d3557'
          },
          handleStyle: {
            borderColor: '#1d3557'
          },
          activeDotStyle: {
            borderColor: '#1d3557'
          }
        }} />
      </div>
    </div>
  );
};

export const GaugeWithSliderRedux = (props: iGaugeWithSliderRedux) => {
  const dispatch = useDispatch();
  const counter = useSelector<iCounterState, (iCounter | undefined)>((state) => getCounterById(state, props.candyCounter.id));
  const value = counter
    ? counter.value
    : props.value;
  return (
    <GaugeWithSlider
      {...props}
      label={props.candyCounter.name.plural}
      value={value}
      color={props.candyCounter.color}
      id={props.candyCounter.id}
      setValue={(value: number) => {
        dispatch(updateCounter({
          id: props.candyCounter.id,
          value
        }));
      }} />
  );
}
