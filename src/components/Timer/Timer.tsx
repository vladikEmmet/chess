import { FC, useEffect, useRef, useState } from 'react';
import { Colors } from '../../models/Colors';
import { Figure, FigureNames } from '../../models/figures/Figure';
import { Player } from '../../models/Player';
import styles from "./Timer.module.css";
import { parseTime } from '../../utils/parseTime';

interface TimerProps {
    currentPlayer: Player | null;
    restart: () => void;
    mode: string | null;
    blackTime: number;
    whiteTime: number;
    isTimerStarted: boolean;
    lostWhiteFigures: Figure[];
    lostBlackFigures: Figure[];
    nominateWinnerByTimeout: (color: Colors) => void;
    nominateDrawByTimeout: () => void;
}

interface ITakenFigures {
    [index: string]: number;
}

const Timer: FC<TimerProps> = ({currentPlayer, restart, nominateWinnerByTimeout, nominateDrawByTimeout, blackTime, whiteTime, isTimerStarted, lostWhiteFigures, lostBlackFigures}) => {
    const[blackTimer, setBlackTimer] = useState(blackTime);
    const[whiteTimer, setWhiteTimer] = useState(whiteTime);
    const [whiteTimeDisplayed, setWhiteTimeDisplayed] = useState(parseTime(whiteTime));
    const [blackTimeDisplayed, setBlackTimeDisplayed] = useState(parseTime(blackTime));
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);
    
    useEffect(() => {
        const black = parseTime(blackTimer);
        const white = parseTime(whiteTimer);

        setWhiteTimeDisplayed(white);
        setBlackTimeDisplayed(black);
    }, [blackTimer, whiteTimer])


    useEffect(() => {
        if(isTimerStarted) {
            startTimer();
        }
    }, [currentPlayer])

    const decrementBlackTimer = () => setBlackTimer(prev => prev - 1);

    const decrementWhiteTimer = () => setWhiteTimer(prev => prev - 1);

    useEffect(() => {
        if(whiteTimer <= 0 && timer.current) {
            clearInterval(timer.current);
            if(isDraw(lostBlackFigures)) {
                nominateDrawByTimeout();
                return;
            }
            nominateWinnerByTimeout(Colors.BLACK);
            return;
        }
        if(blackTimer <= 0 && timer.current) {
            clearInterval(timer.current);
            if(isDraw(lostWhiteFigures)) {
                nominateDrawByTimeout();
                return;
            }
            nominateWinnerByTimeout(Colors.WHITE);
            return;
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

    function isDraw(arr: Figure[]) {
        const takenFigures:ITakenFigures = {};

        for(let i = 0; i < arr.length; i++) {
            const figure = arr[i];
            const name = figure.name;
            if(!takenFigures[name])  {
                takenFigures[name] = 1;
            } else takenFigures[name] += 1;
        }

        console.log(takenFigures);

        if(!takenFigures[FigureNames.PAWN] || takenFigures[FigureNames.PAWN] < 8) return false;
        if(!takenFigures[FigureNames.QUEEN]) return false;
        // TODO: Check for queens on the board (in case of capturing a queened pawn)
        if(!takenFigures[FigureNames.ROOK] || takenFigures[FigureNames.ROOK] <= 1) return false;
        if((takenFigures[FigureNames.KNIGHT] === 2 && !takenFigures[FigureNames.BISHOP]) 
                || (takenFigures[FigureNames.BISHOP] === 2 && !takenFigures[FigureNames.KNIGHT])) return false;

        return true;
    }

    const handleRestart = () => {
        setWhiteTimer(whiteTime);
        setBlackTimer(blackTime);
        restart();
    }

  return (
    <div className={styles.timer}>
        <h2>{blackTimeDisplayed}</h2>
        <div>
            <button onClick={handleRestart}>Restart</button>
        </div>
        <h2>{whiteTimeDisplayed}</h2>
    </div>
  )
}

export default Timer;