import React, { useState, useEffect, useCallback } from 'react'
import Chessboard from 'chessboardjsx'
import * as engine from '../../engines/Engine'
import type { AvailableBots, InitialisedBot } from '../../engines/Bots'
import styles from './GameWithComputer.module.css'
import BotSelector from './BotSelector/BotSelector'
import History from './History/History'
import Button from "./Button/Button"

type SelectedBot = {
  name: string;
  move: InitialisedBot;
} | null;

type BoardMove = {
  sourceSquare: engine.Square;
  targetSquare: engine.Square;
};

const GameWithComputer: React.FC<{
  bots: AvailableBots;
  onGameCompleted: (winner: engine.GameWinner) => void;
}> = ({ bots, onGameCompleted }) => {
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [fen, setFen] = useState<engine.Fen>(engine.newGame);
  const [history, setHistory] = useState<Array<engine.Move>>([]);
  const [whiteBot, setWhiteBot] = useState<SelectedBot>(null);
  const [blackBot, setBlackBot] = useState<SelectedBot>(null);

  const newGame = () => {
    setPlaying(false);
    setFen(engine.newGame);
    setHistory([]);
  };

  const doMove = useCallback(
    (fen: engine.Fen, from: engine.Square, to: engine.Square) => {
      const move = engine.move(fen, from, to);

      if (!move) {
        return;
      }

      const [newFen, action] = move;

      if (engine.isGameOver(newFen)) {
        onGameCompleted(engine.getGameWinner(newFen));
        newGame();
        return;
      }

      setFen(newFen);
      setHistory(history => [...history, action]);
    },
    [onGameCompleted]
  );

  const onDragStart = ({ sourceSquare: from }: Pick<BoardMove, 'sourceSquare'>) => {
    const isWhiteBotTurn = whiteBot && engine.isWhiteTurn(fen);
    const isBlackBotTurn = blackBot && engine.isBlackTurn(fen);

    return isPlaying && engine.isMoveable(fen, from) && !(isWhiteBotTurn || isBlackBotTurn);
  };

  const onMovePiece = ({ sourceSquare: from, targetSquare: to }: BoardMove) => {
    doMove(fen, from, to);
  };

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let isBotMovePlayable = true;

    if (whiteBot && engine.isWhiteTurn(fen)) {
      whiteBot.move(fen).then(({ from, to }: engine.ShortMove) => {
        if (isBotMovePlayable) doMove(fen, from, to);
      });
    }

    if (blackBot && engine.isBlackTurn(fen)) {
      blackBot.move(fen).then(({ from, to }: engine.ShortMove) => {
        if (isBotMovePlayable) doMove(fen, from, to);
      });
    }

    return () => {
      isBotMovePlayable = false;
    };
  }, [isPlaying, fen, whiteBot, blackBot, doMove]);

  return (
    <div className={styles.game}>
      <div className={styles["top-nav"]}>
        <BotSelector
          playerName="White"
          availableBots={bots}
          selectedBot={whiteBot}
          setSelectedBot={setWhiteBot}
          disabled={isPlaying}
        />
        <BotSelector
          playerName="Black"
          availableBots={bots}
          selectedBot={blackBot}
          setSelectedBot={setBlackBot}
          disabled={isPlaying}
        />
        <Button onClick={() => setPlaying(playing => !playing)}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={newGame}>
          Reset
        </Button>
      </div>
      <div className={styles.chessboard}>
        <Chessboard position={fen}
          allowDrag={onDragStart} 
          onDrop={onMovePiece} 
          showNotation={false}
          width={512} 
          darkSquareStyle={{background: "linear-gradient(170deg, #008080, #214343)", boxShadow: "inset 2px 4px 3px 0px #67d4ad, inset -6px -6px 5px 0px rgba(0, 0, 0, 0.25)"}}
          lightSquareStyle={{background: "linear-gradient(170deg, #b5c39e, #619985)", boxShadow: "inset 4px 4px 5px 0px #dfd9ba, inset -8px -6px 5px 0px rgba(0, 0, 0, 0.25)"}}
          dropSquareStyle={{ boxShadow: 'inset 0 0 1px 4px blue' }}
        />
      </div>
      <History history={history} />
    </div>
  );
};

export default GameWithComputer;
