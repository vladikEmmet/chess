import React, { useState, useLayoutEffect, useEffect } from 'react';
import { FenAndPgnMethods } from '../methods/FenAndPgnMethods';
import { FetchMethods } from '../methods/FetchMethods';
import { Board } from '../models/Board';
import { Cell } from '../models/Cell';
import { Colors } from '../models/Colors';
import ChangePawn from './ChangePawn';
import DecidedPuzzle from './DecidedPuzzle';
import PuzzleBoardComponent from './PuzzleBoardComponent';
import WarningWindow from './WarningWindow';

const Puzzle = () => {
    const [board, setBoard] = useState(new Board());
    const [info, setInfo] = useState({title: "", pgn: ""});
    const [playersColor, setPlayersColor] = useState<Colors | null>(Colors.WHITE);
    const [promotedPawn, setPromotedPawn] = useState<Cell | null>(null);
    const [fen, setFen] = useState<string[][]>([]);
    const [pgnArr, setPgnArr] = useState<string[]>([]);
    const [startPgnArr, setStartPgnArr] = useState<string[]>([]);
    const [isWrongMove, setIsWrongMove] = useState<boolean>(false);
    const [decidedPuzzleWindow, setDecidedPuzzleWindow] = useState<boolean>(false);
    
    useLayoutEffect(() => {
        document.title = "Can you solve this puzzle?"
        const newBoard = new Board();
        newBoard.initCells();
        FetchMethods.fetchDailyPuzzle().then(res => {
            setInfo(res);
            const pgn: string[] = res.pgn.split(/\r\n\r\n/)[1].split(/\d\.\s+/g).slice(1).map((i: string) => i.replace(/\r|\n|\*|#/g, ""));
            setPgnArr(pgn);
            setStartPgnArr(pgn);
            return res
        })
        .then(res => {
            const pgn = res.pgn.replaceAll(/\*|#/g, '').split(' ');
            setPlayersColor(pgn[pgn.length - 1].split(' ').length > 1 ? Colors.BLACK : Colors.WHITE);
            return res
        })
        .then(res => {
            const fen = FenAndPgnMethods.convertFenToArray(res.fen);
            setFen(fen);
            return fen
        })
        .then(fen => newBoard.createStartPosition(fen))
        .then(res => setBoard(newBoard))
    }, [])

    useEffect(() => console.log(fen))

    
    
    function restart() {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.createStartPosition(fen);
        setBoard(newBoard);
        setPgnArr(startPgnArr);
        setIsWrongMove(false);
    }
    
    const indicatePromotedPawn = (cell: Cell | null) => setPromotedPawn(cell);

    const showCongrats = () => setDecidedPuzzleWindow(true);

    const promotePawn = () => setPromotedPawn(null);

    const createWarningWindow = () => setIsWrongMove(true);

    const removePgnElement = () => setPgnArr(pgnArr.slice(1));
    
    return (
        <div className="puzzle">
            <PuzzleBoardComponent 
                pgnArr={pgnArr} 
                board={board} 
                setBoard={setBoard} 
                playersColor={playersColor} 
                indicatePromotedPawn={indicatePromotedPawn} 
                createWarningWindow={createWarningWindow} 
                removePgnElement={removePgnElement} 
                showCongrats={showCongrats}
                title={info.title}
            />
            {promotedPawn && <ChangePawn color={promotedPawn.figure?.color} promotedPawn={promotedPawn} board={board} handleClick={promotePawn} />}
            {isWrongMove && <WarningWindow restart={restart}/>}
            {decidedPuzzleWindow && <DecidedPuzzle />}
            <div className={["curtain", (isWrongMove || decidedPuzzleWindow) ? "active" : ""].join(' ')}></div>
            
        </div>
    )
}

export default Puzzle;