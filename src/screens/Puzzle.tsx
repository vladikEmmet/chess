import {useState, useLayoutEffect} from 'react';
import { FenAndPgnMethods } from '../methods/FenAndPgnMethods';
import { FetchMethods } from '../methods/FetchMethods';
import { Board } from '../models/Board';
import { Cell } from '../models/Cell';
import { Colors } from '../models/Colors';
import ChangePawn from '../components/ChangePawn/ChangePawn';
import DecidedPuzzle from '../components/popups/DecidedPuzzle/DecidedPuzzle';
import PuzzleBoardComponent from '../components/PuzzleBoardComponent';
import WarningWindow from '../components/popups/WarningWindow';

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
    const [isLoading, setIsLoading] = useState(false);


    useLayoutEffect(() => {
        document.title = "Can you solve this puzzle?"
        setIsLoading(true);
        const newBoard = new Board();
        newBoard.initCells();
        FetchMethods.fetchDailyPuzzle()
            .then(res => {
                setInfo(res);
                const pgnTmp: string[] = res.pgn.split(/\r\n\r\n/)[1].split(/\d\.\s+/g).slice(1).map((i: string) => i.replace(/[\r\n*#]/g, ""));
                setPgnArr(pgnTmp);
                setStartPgnArr(pgnTmp);
                const pgn = res.pgn.replaceAll(/[*#]/g, '').split(' ');
                setPlayersColor(pgn[pgn.length - 1].split(' ').length > 1 ? Colors.BLACK : Colors.WHITE);
                const fen = FenAndPgnMethods.convertFenToArray(res.fen);
                setFen(fen);
                newBoard.createStartPosition(fen);
                setBoard(newBoard);
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong. Please try again later.");
            })
            .finally(() => setIsLoading(false));
    }, [])

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

    if(isLoading) {
        return <h1 style={{color: "#fff", textAlign: "center"}}>I am loading puzzle...</h1>
    }

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