import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocalStorage } from '../../hooks';
import { candyCounters, CandyCounter, getCandyCountersById } from '../../candies';
import { aggregateCountersSelector, getHistory, addHistory, HistoryEntry } from '../../store';

export interface iInfoBoard {
  title: string;
  subTitle: string;
  value: number;
  history: HistoryEntry[];
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
            const candyCounter = getCandyCountersById(entry.counterId, candyCounters);
            if (candyCounter && candyCounter.updateMessageTemplate) {
              return (
                <li className="infoboard__log-entry" key={index}>
                  {candyCounter.updateMessageTemplate(entry.newValue, entry.oldValue)}
                </li>
              );
            }
            return null;
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
  const dispatch = useDispatch();
  const [ valueState, setValueState ] = useLocalStorage('infoboard_state', []);

  useEffect(() => {
    if (history.length) {
      setValueState(history);
    } else if (valueState.length) {
      dispatch(addHistory(valueState));
    }
  }, [history, valueState]);

  return (
    <InfoBoard
      {...props}
      history={history}
      value={value} />
  );
}
