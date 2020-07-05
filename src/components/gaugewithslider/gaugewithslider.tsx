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
import { SingularPluralString } from '../../candies';

export interface iGaugeWithSlider extends iGauge {
  componentId: string;
  colspan?: number;
  handleChange?: Function;
  handleCleanUp?: Function;
}

export interface iGaugeWithSliderRedux extends iGaugeWithSlider {
  singularPluralLabel: SingularPluralString;
}

const updateMessageTemplateCreator =
(name: SingularPluralString, color?: string): CounterUpdateMessageTemplate  =>
(newValue: number, oldValue: number): (JSX.Element | null) => {
  const difference = newValue - oldValue;
  if (difference > 0) {
    return (
      <span>
        <span role="img" aria-label="Candy icon">🍬 </span>
        +{difference} {difference === 1
          ? <span style={{ color: color || '' }}>{name.singular}</span>
          : <span style={{ color: color || '' }}>{name.plural}</span>} added
      </span>
    );
  } else if (difference < 0) {
    return (
      <span>
        <span role="img" aria-label="Candy icon">🍬 </span>
        -{Math.abs(difference)} {Math.abs(difference) === 1
          ? <span style={{ color: color || '' }}>{name.singular}</span>
          :<span style={{ color: color || '' }}>{name.plural}</span>} removed
      </span>
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

export const GaugeWithSliderRedux = (props: iGaugeWithSliderRedux) => {
  const dispatch = useDispatch();
  const updateMessageTemplate = props.color
    ? updateMessageTemplateCreator(props.singularPluralLabel, props.color)
    : updateMessageTemplateCreator(props.singularPluralLabel);

  return (
    <GaugeWithSlider
      handleChange={(value: iCounter) => {
        // Update / add counter data into the store
        dispatch(updateCounter({
          ...value,
          updateMessageTemplate
        }))}
      }
      handleCleanUp={(value: iCounter) => {
        // Remove counter data from the store
        dispatch(removeCounter(value))}
      }
      {...props} />
  );
}
