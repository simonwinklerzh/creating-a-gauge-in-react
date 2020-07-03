import React from 'react';
import { useSelector } from 'react-redux';
import { aggregateCountersSelector } from '../../store';

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
  const val = useSelector(aggregateCountersSelector);
  return (<InfoBoard value={val} />);
}
