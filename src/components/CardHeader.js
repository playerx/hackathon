import React from "react";

const CardHeader = ({ setIsNewMsg }) => {
  return (
    <div className="flex justify-between align-center">
      <div>
        <h4>Games</h4>
      </div>
      <div>
        <button onClick={() => setIsNewMsg(true)} className="btn">
          + New Game
        </button>
      </div>
    </div>
  );
};

export default CardHeader;
