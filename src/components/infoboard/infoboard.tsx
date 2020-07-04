import React from 'react';
import { useSelector } from 'react-redux';
import { aggregateCountersSelector, getHistory } from '../../store';

export interface iInfoBoard {
  value: number;
  history: string[];
}

export const InfoBoard = ({
  value = 0,
  history = []
} : iInfoBoard) => {
  return (
    <div className="infoboard">
      <p
        className="infoboard__value">
        {`Total number of bubble gums: ${value}`}
      </p>
      <div style={{ display: 'flex' }}>
        <ul>
          {
            history.map((entry, index) => {
              return (<li key={index}>{entry}</li>);
            })
          }
        </ul>
      </div>
    </div>
  );
}

export const InfoBoardRedux = () => {
  const value = useSelector(aggregateCountersSelector);
  const history = useSelector(getHistory);
  return (
    <InfoBoard
      history={history}
      value={value} />
  );
}
