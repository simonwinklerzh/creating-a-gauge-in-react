import React from 'react';
import { store, clearState } from '../../store';

export interface iButton {
  clickHandler: Function;
  modifierClass: ButtonModifierClass;
  text: string;
}

export type ButtonModifierClass =
  'reset' | '';

export const Button = ({
  clickHandler = () => {},
  modifierClass = '',
  text = 'Button'
}) => (
  <button
    className={`button ${ modifierClass ? `button--${modifierClass}` : '' }`}
    onClick={clickHandler}
    type="button">{text}</button>
);

export const ResetButtonRedux = () => (
  <Button modifierClass="reset" text="Reset" clickHandler={handleResetButtonClick} />
);

function handleResetButtonClick() {
  store.dispatch(clearState(undefined));
}
