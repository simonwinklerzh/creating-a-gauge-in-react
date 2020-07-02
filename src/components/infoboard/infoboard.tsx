import React from 'react';

export interface iInformationBoard {
  value: number;
}

export const InformationBoard = ({
  value = 0
}) => {
  return (
    <div className="infoboard">
      <p className="infoboard__value">{value}</p>
    </div>
  );
}
