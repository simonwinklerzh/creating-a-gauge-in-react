import React from 'react';
import { useSelector } from 'react-redux';
import { iCounterState } from '../../store';

export interface iInfoBoard {
  value: number;
}

export const InfoBoard = ({
  value = 0
} : iInfoBoard) => {
  return (
    <div className="infoboard">
      <p
        className="infoboard__value">
        {`Total number of bubble gums: ${value}`}
      </p>
    </div>
  );
}

export const InfoBoardRedux = () => {
  const val = useSelector((state: iCounterState) => state.counters.reduce(function(accumulator, current) {
    return accumulator + current.value;
  }, 0));

  return (<InfoBoard value={val} />);
}
