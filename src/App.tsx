import { useEffect, useState } from 'react';
import "./App.css";
import { BoardComponent } from './components/BoardComponent';
import ChangePawn from './components/ChangePawn';
import GameOverPopUp, { IGameInfo } from './components/GameOverPopUp';
import LostFigures from './components/LostFigures';
import ModeSelection from './components/ModeSelection';
import Timer from './components/Timer';
import { Board } from './models/Board';
import { Cell } from './models/Cell';
import { Colors } from './models/Colors';
import { Player } from './models/Player';

const App = () => {
  const [board, setBoard] = useState(new Board());
  const [gameResult, setGameResult] = useState<IGameInfo>({result: "", winner: null, reason: ""});
  const [promotedPawn, setPromotedPawn] = useState<Cell | null>(null);
  const [whiteTime, setWhiteTime] = useState<number>(300);
  const [blackTime, setBlackTime] = useState<number>(300);
  const [isTimerStarted, setIsTimerStarted] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<string>("classic");
  const [isParametersSpecified, setIsParametersSpecified] = useState<boolean>(false);
  const [whitePlayer] = useState<Player>(new Player(Colors.WHITE));
  const [blackPlayer] = useState<Player>(new Player(Colors.BLACK));
  const [whiteValue, setWhiteValue] = useState<number>(0);
  const [blackValue, setBlackValue] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  
  useEffect(() => {
    restart(gameMode || "classic");
    document.title = gameMode === "classic" ? "Classic chess" : "Chess 960";
  }, [gameMode])

  function setTimer(time: number) {
    setWhiteTime(time);
    setBlackTime(time);
  }

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
    setCurrentPlayer(whitePlayer)
    setGameResult({result: "", winner: null, reason: ""})
  }

  const addWhitePlayerValue = (value: number) => setWhiteValue(value);
  const addBlackPlayerValue = (value: number) => setBlackValue(value);

  const swapPlayers = () => setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer)

  const promotePawn = () => setPromotedPawn(null);
  const indicatePromotedPawn = (cell: Cell) => setPromotedPawn(cell);
  
  const createPopup = (result: string, winner: string, reason: string) => setGameResult({result: result, winner: winner, reason: reason});
  const nominateWinnerByMate = (color: Colors) => createPopup("wins", color, "By mate");
  const nominateWinnerByTimeout = (color: Colors) => createPopup("wins", color, "By timeout");
  
  const setMode = (mode: string) => setGameMode(mode);
  const setParameters = () => setIsParametersSpecified(true);

  const startTimer = () => setIsTimerStarted(true);

  const goBack = () => {
    setIsParametersSpecified(false);
    restart(gameMode);
    setWhiteTime(300);
    setBlackTime(300);
    setIsTimerStarted(false);
  }

  
  return (
    <div className="app">
      <Timer
        restart={restart}
        mode={gameMode}
        currentPlayer={currentPlayer}
        blackTime={blackTime}
        whiteTime={whiteTime}
        isTimerStarted={isTimerStarted}
        nominateWinnerByTimeout={nominateWinnerByTimeout} />
      <BoardComponent
        isPuzzle={false}
        board={board}
        startTimer={startTimer}
        setBoard={setBoard}
        nominateWinnerByMate={nominateWinnerByMate}
        currentPlayer={currentPlayer}
        swapPlayers={swapPlayers}
        indicatePromotedPawn={indicatePromotedPawn} />
      <LostFigures figures={board.lostWhiteFigures} addValue={addWhitePlayerValue} diff={whiteValue > blackValue ? whiteValue - blackValue : 0} />
      <LostFigures figures={board.lostBlackFigures} addValue={addBlackPlayerValue} diff={whiteValue < blackValue ? blackValue - whiteValue : 0} />
      <GameOverPopUp visibility={gameResult.winner !== null} info={gameResult} goBack={goBack} />
      {!isParametersSpecified && <ModeSelection setParameters={setParameters} setTimer={setTimer} setMode={setMode} time={whiteTime} mode={gameMode} />}
      {promotedPawn && <ChangePawn color={promotedPawn?.figure?.color} promotedPawn={promotedPawn} board={board} handleClick={promotePawn} />}
      <div className={["curtain", gameResult.winner !== null ? "active" : ""].join(' ')}></div>
    </div>
  )
}

export default App;