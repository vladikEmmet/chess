import { useEffect, useState, useCallback } from 'react';
import "./App.css";
import BackToMenu from './components/BackToMenu';
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
  }, [gameMode])

  useEffect(() => {
    console.log('render');
  })

  let setTimer = useCallback((time: number) => {
    setWhiteTime(time);
    setBlackTime(time);
  }, []);

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

  const restartTimer = () => restart(gameMode);

  const addWhitePlayerValue = (value: number) => setWhiteValue(value);
  const addBlackPlayerValue = (value: number) => setBlackValue(value);

  const swapPlayers = () => setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer)

  
  const createPopup = (result: string, winner: string | null, reason: string) => setGameResult({result: result, winner: winner, reason: reason});
  const nominateWinnerByMate = (color: Colors) => createPopup("wins", color, "By mate");
  const nominateWinnerByTimeout = (color: Colors) => createPopup("wins", color, "By timeout");
  const nominateDrawByStaleMate = () => createPopup("Draw", null, "By stalemate");
  
  const setMode = useCallback((mode: string) => setGameMode(mode), []);
  const setParameters = () => {
    setIsParametersSpecified(true);
    document.title = gameMode === "960" ? "Chess 960" : "Classic chess";
  }
  
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

  const goBack = () => {
    setIsParametersSpecified(false);
    restart(gameMode);
    setIsTimerStarted(false);
  }

  
  return (
    <div className="app">
      <BackToMenu handleClick={() => {
        setIsParametersSpecified(false);
        restart(gameMode);
      }} />
      <Timer
        restart={restartTimer}
        mode={gameMode}
        currentPlayer={currentPlayer}
        blackTime={blackTime}
        whiteTime={whiteTime}
        lostWhiteFigures={board.lostWhiteFigures}
        lostBlackFigures={board.lostBlackFigures}
        isTimerStarted={isTimerStarted}
        nominateWinnerByTimeout={nominateWinnerByTimeout} />
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
      />
      <LostFigures figures={board.lostWhiteFigures} addValue={addWhitePlayerValue} diff={whiteValue > blackValue ? whiteValue - blackValue : 0} />
      <LostFigures figures={board.lostBlackFigures} addValue={addBlackPlayerValue} diff={whiteValue < blackValue ? blackValue - whiteValue : 0} />
      <GameOverPopUp visibility={gameResult.result.length !== 0} info={gameResult} goBack={goBack} />
      {!isParametersSpecified && <ModeSelection setParameters={setParameters} setTimer={setTimer} setMode={setMode} time={whiteTime} mode={gameMode} />}
      {promotedPawn && <ChangePawn color={promotedPawn?.figure?.color} promotedPawn={promotedPawn} board={board} handleClick={promotePawn} />}
      <div className={["curtain", gameResult.result.length !== 0 ? "active" : ""].join(' ')}></div>
    </div>
  )
}

export default App;