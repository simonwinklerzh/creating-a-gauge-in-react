import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Slider from 'rc-slider';
import { Gauge, iGauge } from '../gauge/gauge';
import { useLocalStorage } from '../../hooks';
import {
  removeCounter,
  updateCounter,
  iCounter,
  iCounterUpdateMessageTemplate
} from '../../store';
import { SingularPluralString } from '../../candies';

export interface iGaugeWithSlider extends iGauge {
  colspan?: number;
  value: number;
  setValue?: (value: number) => void;
}

export interface iGaugeWithSliderRedux extends iGaugeWithSlider {
  componentId: string;
  singularPluralLabel: SingularPluralString;
}

const updateMessageTemplateCreator =
(name: SingularPluralString, color?: string): iCounterUpdateMessageTemplate  =>
(newValue: number, oldValue: number) => {
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
  const updateMessageTemplate = props.color
    ? updateMessageTemplateCreator(props.singularPluralLabel, props.color)
    : updateMessageTemplateCreator(props.singularPluralLabel);

  /**
   * Connect values from <GaugeWithSlider /> with the store
   */
  useEffect(() => {
    dispatch(updateCounter({
      id: props.componentId,
      value: valueState,
      updateMessageTemplate
    }));
  }, [valueState, props.componentId, dispatch, updateMessageTemplate]);


  /**
   * Disconnect <GaugeWithSlider /> from the store
   */
  useEffect(() => {
    return () => {
      dispatch(removeCounter({
        id: props.componentId,
        value: 0,
        updateMessageTemplate: () => {}
      }))
    };
  }, [props.componentId, dispatch]);

  return (
    <GaugeWithSlider
      {...props}
      value={valueState}
      setValue={setValuestate} />
  );
}
