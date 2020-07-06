import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Slider from 'rc-slider';
import { Gauge, iGauge } from '../gauge/gauge';
import { useLocalStorage } from '../../hooks';
import {
  removeCounter,
  updateCounter
} from '../../store';
import { CandyCounter } from '../../candies';

export interface iGaugeWithSlider extends iGauge {
  colspan?: number;
  value: number;
  setValue?: (value: number) => void;
  candyCounter: CandyCounter;
}

export interface iGaugeWithSliderRedux extends iGaugeWithSlider {
  componentId: string;
}

export const GaugeWithSlider = ({
  value = 60,
  setValue = (n: number) => {},
  min = 0,
  max = 200,
  label = "Speed",
  color,
  units = "kilometers per hour",
  colspan = 1
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
        units
      }} />
      <div className="gaugewithslider__slider">
        <Slider {...{
          value,
          min,
          max,
          marks: {[min]: String(min), [max]: String(max)},
          onChange: setValue
        }} />
      </div>
    </div>
  );
};

export const GaugeWithSliderRedux = (props: iGaugeWithSliderRedux) => {
  const dispatch = useDispatch();
  const [ valueState, setValuestate ] = useLocalStorage(`gauge_control_center_state_${props.componentId}`, props.value);

  /**
   * Connect values from <GaugeWithSlider /> with the store
   */
  useEffect(() => {
    dispatch(updateCounter({
      ...props.candyCounter,
      value: valueState
    }));
  }, [valueState, props.componentId, props.candyCounter, dispatch]);


  /**
   * Disconnect <GaugeWithSlider /> from the store
   */
  useEffect(() => {
    return () => {
      dispatch(removeCounter({
        id: props.componentId,
        value: 0,
        updateMessageTemplate: () => {}
      }));
    };
  }, [props.componentId, dispatch]);

  return (
    <GaugeWithSlider
      {...props}
      value={valueState}
      setValue={setValuestate} />
  );
}
