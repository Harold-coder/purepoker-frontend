import React from 'react';
import './Pot.css';

const Pot = ({ pot }) => {
  return (
    <div className="pot-amount">
      <div>
        Pot: {pot}
      </div>
    </div>
  );
};

export default Pot;
