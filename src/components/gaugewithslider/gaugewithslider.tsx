import React, { useEffect } from 'react';
import Slider from 'rc-slider';
import { Gauge, iGauge } from '../gauge/gauge';
import { useLocalStorage } from '../../hooks';
import { store, removeCounter, updateCounter, iCounter } from '../../store';

export interface iGaugeWithSlider extends iGauge {
  componentId: string;
  colspan?: number;
  handleChange?: Function;
  handleCleanUp?: Function;
}

export const GaugeWithSlider = ({
  value = 60,
  min = 0,
  max = 200,
  label = "Speed",
  units = "kilometers per hour",
  componentId = '', // Provide a component ID if you want to persist the state to local storage
  colspan = 1,
  handleChange,
  handleCleanUp
}: iGaugeWithSlider = { componentId: '' }) => {
  const [ valueState, setValuestate ] = useLocalStorage(`gauge_control_center_state_${componentId}`, value);

  /**
   * Execute the change handler when the state value
   * changes or when the id of the component changes.
   */
  useEffect(() => {
    if (handleChange) {
      handleChange({
        id: componentId,
        value: valueState
      });
    }
  }, [valueState, componentId, handleChange]);

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
  return (
    <GaugeWithSlider
      handleChange={(value: iCounter) => {
        // Update / add counter data into the store
        store.dispatch(updateCounter(value))}
      }
      handleCleanUp={(value: iCounter) => {
        // Remove counter data from the store
        store.dispatch(removeCounter(value))}
      }
      {...props} />
  );
}
