import React from 'react';
import { useSelector } from 'react-redux';
import { aggregateCountersSelector, getHistory } from '../../store';

export interface iInfoBoard {
  title: string;
  subTitle: string;
  value: number;
  history: string[];
}

export const InfoBoard = ({
  title = 'Information Board',
  subTitle = 'Displays a value and log-like information',
  value = 0,
  history = []
} : iInfoBoard) => {
  return (
    <div className="infoboard">
      <h2 className="infoboard__title">{title}</h2>
      <p className="infoboard__value">{value}</p>
      <p className="infoboard__subtitle">{subTitle}</p>
      <ul className="infoboard__log">
        {
          history.map((entry, index) => {
            return (<li className="infoboard__log-entry" key={index}>{entry}</li>);
          })
        }
      </ul>
    </div>
  );
}

export const InfoBoardRedux = (props: {
  title: string, subTitle: string
}) => {
  const value = useSelector(aggregateCountersSelector);
  const history = useSelector(getHistory);
  return (
    <InfoBoard
      {...props}
      history={history}
      value={value} />
  );
}
