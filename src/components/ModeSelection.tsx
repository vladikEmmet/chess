import React, {FC} from 'react'
import { Link } from 'react-router-dom';

interface ModeSelectionProps {
    setTimer: (time: number) => void;
    setMode: (mode: string) => void;
    setParameters: () => void;
    time: number;
    mode: string | null;
}

const ModeSelection: FC<ModeSelectionProps> = ({setTimer, setMode, setParameters, time, mode}) => {
  return (
    <div className="mode-selection-container">
        <div className="mode-selection-settings">
            <div className="mode-selection-titles">
                <h1 className="mode-selection-title">Welcome to Chess!</h1>
                <h4 className="mode-selection-title">Specify the required parameters</h4>
            </div>
            <hr />
            <div className="selected-settings">
                <h2>Time: {time}</h2>
                <h2>Mode: {mode === null ? "none" : mode}</h2>
            </div>
            <hr />
            <div className="mode-selection-timer-settings mode-settings">
                <h2>Time</h2>
                <button onClick={() => setTimer(60)}>1 minute</button>
                <button onClick={() => setTimer(300)}>5 minutes</button>
                <button onClick={() => setTimer(600)}>10 minutes</button>
            </div>
            <div className="mode-selection-mode-settings mode-settings">
                <h2>Mode</h2>
                <button onClick={() => setMode("classic")}>Classic Chess</button>
                <button onClick={() => setMode("960")}>Сhess960</button>
            </div>
            <button className="mode-selection-play-game-btn" onClick={setParameters}>Play</button>
            <Link className="puzzle-link" to="puzzle" onClick={setParameters}>Random Puzzle</Link>
        </div>
      </div>
  )
}

export default ModeSelection;