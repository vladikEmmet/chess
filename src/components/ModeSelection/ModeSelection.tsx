import {FC, useEffect} from 'react'
import { Link } from 'react-router-dom'
import styles from "./ModeSelection.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

interface ModeSelectionProps {
    setTimer: (time: number) => void;
    setMode: (mode: string) => void;
    time: number;
    mode: string | null;
}

const ModeSelection: FC<ModeSelectionProps> = ({setTimer, setMode, time, mode}) => {

  useEffect(() => console.log("render app"));

  useEffect(() => {
    document.title = "Chess"
  }, []);

  return (
    <div className={styles["mode-selection-container"]}>
        <div className={styles["mode-selection-settings"]}>
            <div className={styles["mode-selection-titles"]}>
                <h1 className={styles["mode-selection-title"]}>Welcome to Chess!</h1>
                <h4 className={styles["mode-selection-title"]}>Specify the required parameters</h4>
            </div>
            <hr />
            <div className="selected-settings">
                <h2>Time: {`${time} sec`}</h2>
                <h2>Mode: {mode === null ? "none" : mode}</h2>
            </div>
            <hr />
            <div className={[styles["mode-selection-timer-settings"], styles["mode-settings"]].join(' ')}>
                <h2>Time</h2>
                <button onClick={() => setTimer(60)}>1 minute</button>
                <button onClick={() => setTimer(300)}>5 minutes</button>
                <button onClick={() => setTimer(600)}>10 minutes</button>
            </div>
            <div className={[styles["mode-selection-mode-settings"], styles["mode-settings"]].join(' ')}>
                <h2>Mode</h2>
                <button onClick={() => setMode("classic")}>Classic Chess</button>
                <button onClick={() => setMode("960")}>Сhess960</button>
            </div>
            <Link to="singleplayer" className={styles["mode-selection-play-game-btn"]}>Play</Link>
            <div className={styles["another-models-links"]}>
                <Link className={styles["puzzle-link"]} to="puzzle">Random Puzzle</Link>
                <div className={styles["play-with-computer-beta-link"]}>
                    <Link className={styles["computer-link"]} to="game-with-computer">Play with computer</Link>
                    <span className={styles.tooltip} data-tooltip="Test feature. A simplified version of the board is used here to facilitate interaction with the UCI">
                        <FontAwesomeIcon icon={faCircleInfo}/>
                    </span>
                </div>
            </div>
        </div>
      </div>
  )
}

export default ModeSelection;