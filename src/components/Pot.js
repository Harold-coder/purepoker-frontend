import React from 'react';

const Pot = ({ pot }) => {
  return (
    <div className="pot-amount" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '24px', color: 'gold', fontWeight: 'bold', marginTop: '10px' }}>
        Pot: {pot}
      </div>
    </div>
  );
};

export default Pot;
