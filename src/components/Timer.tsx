import React, { FC, useEffect, useRef, useState } from 'react';
import { Colors } from '../models/Colors';
import { Player } from '../models/Player';

interface TimerProps {
    currentPlayer: Player | null;
    restart: (mode: string | null) => void;
    mode: string | null;
    blackTime: number;
    whiteTime: number;
    isTimerStarted: boolean;
    nominateWinnerByTimeout: (color: Colors) => void;
}

const Timer: FC<TimerProps> = ({currentPlayer, restart, nominateWinnerByTimeout, blackTime, whiteTime, isTimerStarted, mode}) => {
    const[blackTimer, setBlackTimer] = useState(blackTime);
    const[whiteTimer, setWhiteTimer] = useState(whiteTime);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);
    
    useEffect(() => {
        if(isTimerStarted) {
            startTimer();
        }
    }, [currentPlayer])

    useEffect(() => {
        if(whiteTimer <= 0 && timer.current) {
            clearInterval(timer.current);
            nominateWinnerByTimeout(Colors.BLACK);
        }
        if(blackTimer <= 0 && timer.current) {
            clearInterval(timer.current);
            nominateWinnerByTimeout(Colors.WHITE);
        }
    }, [whiteTimer, blackTimer])

    useEffect(() => {
        setBlackTimer(blackTime);
        setWhiteTimer(whiteTime);
    }, [blackTime, whiteTime]);
    
    function startTimer() {
        if(timer.current) {
            clearInterval(timer.current);
        }
        const callback = currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
        timer.current = setInterval(callback, 1000);
    }

    function decrementBlackTimer() {
        setBlackTimer(prev => prev - 1)
    }

    function decrementWhiteTimer() {
        setWhiteTimer(prev => prev - 1)
    }

    const handleRestart = () => {
        setWhiteTimer(whiteTime);
        setBlackTimer(blackTime);
        restart(mode);
    }

  return (
    <div className="timer">
        <h2>{blackTimer}</h2>
        <div>
            <button onClick={handleRestart}>Restart</button>
        </div>
        <h2>{whiteTimer}</h2>
    </div>
  )
}

export default Timer;