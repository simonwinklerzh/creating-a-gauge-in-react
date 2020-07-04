import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Slider from 'rc-slider';
import { Gauge, iGauge } from '../gauge/gauge';
import { useLocalStorage } from '../../hooks';
import {
  removeCounter,
  updateCounter,
  iCounter,
  CounterUpdateMessageTemplate
} from '../../store';

export interface iGaugeWithSlider extends iGauge {
  componentId: string;
  colspan?: number;
  handleChange?: Function;
  handleCleanUp?: Function;
}

const updateMessageTemplateCreator =
(name: string, color?: string): CounterUpdateMessageTemplate  =>
(newValue: number, oldValue: number): (JSX.Element | null) => {
  const difference = newValue - oldValue;
  if (difference > 0) {
    return (
      <p style={{ color: color || '' }}>
        {difference} {name} added
      </p>
    );
  } else if (difference < 0) {
    return (
      <p style={{ color: color || '' }}>
        {Math.abs(difference)} {name} removed
      </p>
    );
  }
  return null;
}

export const GaugeWithSlider = ({
  value = 60,
  min = 0,
  max = 200,
  label = "Speed",
  color,
  units = "kilometers per hour",
  componentId = '', // Provide a component ID if you want to persist the state to local storage
  colspan = 1,
  handleChange,
  handleCleanUp,
}: iGaugeWithSlider = { componentId: '' }) => {
  const [ valueState, setValuestate ] = useLocalStorage(`gauge_control_center_state_${componentId}`, value);
  const updateMessageTemplate = color
    ? updateMessageTemplateCreator(label, color)
    : updateMessageTemplateCreator(label);

  /**
   * Execute the change handler when the state value
   * changes or when the id of the component changes.
   */
  useEffect(() => {
    if (handleChange) {
      handleChange({
        id: componentId,
        value: valueState,
        updateMessageTemplate
      });
    }
  }, [valueState, componentId, handleChange, updateMessageTemplate]);

  /**
   * Execute cleanup function when the id of the
   * component changes or when the component will unmount.
   */
  useEffect(() => {
    return () => {
      if (handleCleanUp) {
        handleCleanUp({
          id: componentId
        })
      }
    }
  }, [componentId, handleCleanUp]);

  if (!componentId) {
    console.error('You must provide a (unique persistent) id for this component to work properly');
    return null;
  }

  return (
    <div
      className="gaugewithslider"
      style={{
        gridColumnStart: `span ${colspan}`
      }}>
      <Gauge {...{
        value: valueState,
        min,
        max,
        label,
        units
      }} />
      <div className="gaugewithslider__slider">
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

export const GaugeWithSliderRedux = (props: iGaugeWithSlider) => {
  const dispatch = useDispatch();
  return (
    <GaugeWithSlider
      handleChange={(value: iCounter) => {
        // Update / add counter data into the store
        dispatch(updateCounter(value))}
      }
      handleCleanUp={(value: iCounter) => {
        // Remove counter data from the store
        dispatch(removeCounter(value))}
      }
      {...props} />
  );
}
