import { FC, useEffect, useState, useCallback } from 'react';
import { BoardComponent } from './BoardComponent';
import ChangePawn from './ChangePawn/ChangePawn';
import GameOverPopUp, { IGameInfo } from './popups/GameOverPopUp';
import LostFigures from './LostFigures/LostFigures';
import RotateBoardButton from './rotateBoardButton/RotateBoardButton';
import Timer from './Timer/Timer';
import { Board } from '../models/Board';
import { Cell } from '../models/Cell';
import { Colors } from '../models/Colors';
import { Player } from '../models/Player';

interface SinglePlayerProps {
    mode: string | null;
    whiteTime: number;
    blackTime: number;
}

const SinglePlayer: FC<SinglePlayerProps> = ({mode, whiteTime, blackTime}) => {
    const [board, setBoard] = useState(new Board());
    const [gameResult, setGameResult] = useState<IGameInfo>({result: "", winner: null, reason: ""});
    const [promotedPawn, setPromotedPawn] = useState<Cell | null>(null);
    const [isTimerStarted, setIsTimerStarted] = useState<boolean>(false);
    const [whitePlayer] = useState<Player>(new Player(Colors.WHITE));
    const [blackPlayer] = useState<Player>(new Player(Colors.BLACK));
    const [whiteValue, setWhiteValue] = useState<number>(0);
    const [blackValue, setBlackValue] = useState<number>(0);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [isBoardRotated, setIsBoardRotated] = useState(false);

    useEffect(() => {
        restart(mode);
        document.title = mode === "classic" ? "Classic chess" : "Chess 960";
    }, [])

    function restart(mode: string | null) {
      const newBoard = new Board();
      newBoard.initCells()
      switch(mode) {
        case "960":
          newBoard.addFisherFigures()
          break;
          case "classic":
          default:
          newBoard.addFigures()
          break;
      }
      setBoard(newBoard)
      setPromotedPawn(null);
      setCurrentPlayer(whitePlayer)
      setGameResult({result: "", winner: null, reason: ""})
    }

    const restartTimer = () => restart(mode);

    const addWhitePlayerValue = (value: number) => setWhiteValue(value);
    const addBlackPlayerValue = (value: number) => setBlackValue(value);

    const swapPlayers = () => setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer)


    const createPopup = (result: string, winner: string | null, reason: string) => {
      setGameResult({result: result, winner: winner, reason: reason})
      setIsTimerStarted(false);
    };
    const nominateWinnerByMate = (color: Colors) => createPopup("wins", color, "By mate");
    const nominateWinnerByTimeout = (color: Colors) => createPopup("wins", color, "By timeout");
    const nominateDrawByStaleMate = () => createPopup("Draw", null, "By stalemate");
    const nominateDrawByTimeout = () => createPopup("Draw", null, "Time is up, but not enough pieces to checkmate");

    const startTimer = useCallback(() => setIsTimerStarted(true), []);

    const promotePawn = () => {
      if(!promotedPawn || !promotedPawn.figure) return;
      const enemyColor = promotedPawn.figure.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

      if(board.getCell(promotedPawn.x, promotedPawn.y).isMate(enemyColor)) {
        nominateWinnerByMate(promotedPawn.figure.color);
      }
      setPromotedPawn(null);
    };

    const indicatePromotedPawn = (cell: Cell) => setPromotedPawn(cell);

    const rotateBoard = () => {
      setIsBoardRotated(prev => !prev);
    }


    return (
      <div className="app">
          <Timer
              restart={restartTimer}
              mode={mode}
              currentPlayer={currentPlayer}
              blackTime={blackTime}
              whiteTime={whiteTime}
              lostWhiteFigures={board.lostWhiteFigures}
              lostBlackFigures={board.lostBlackFigures}
              isTimerStarted={isTimerStarted}
              nominateWinnerByTimeout={nominateWinnerByTimeout}
              nominateDrawByTimeout={nominateDrawByTimeout}
          />
        <BoardComponent
          isPuzzle={false}
          board={board}
          startTimer={startTimer}
          setBoard={setBoard}
          nominateWinnerByMate={nominateWinnerByMate}
          nominateDrawByStaleMate={nominateDrawByStaleMate}
          currentPlayer={currentPlayer}
          swapPlayers={swapPlayers}
          indicatePromotedPawn={indicatePromotedPawn}
          isRotated={isBoardRotated}
        />
        <RotateBoardButton onClick={rotateBoard}/>
          <LostFigures figures={board.lostWhiteFigures} addValue={addWhitePlayerValue} diff={whiteValue > blackValue ? whiteValue - blackValue : 0} />
          <LostFigures figures={board.lostBlackFigures} addValue={addBlackPlayerValue} diff={whiteValue < blackValue ? blackValue - whiteValue : 0} />
        <GameOverPopUp visibility={gameResult.result.length !== 0} info={gameResult} />
        {promotedPawn && <ChangePawn color={promotedPawn?.figure?.color} promotedPawn={promotedPawn} board={board} handleClick={promotePawn} />}
        <div className={["curtain", gameResult.result.length !== 0 || promotedPawn ? "active" : ""].join(' ')}></div>
      </div>
    )
}

export default SinglePlayer