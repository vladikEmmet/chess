import React, { FC } from 'react';

interface WarningWindowProps {
  restart: () => void;
}

const WarningWindow: FC<WarningWindowProps> = ({restart}) => {
  return (
    <div className="puzzle-popup">
        <h1>Wrong move!</h1>
        <button onClick={restart}>Retry</button>
    </div>
  )
}

export default WarningWindow;