import React, {FC, useState, useEffect, useRef} from 'react';
import { Board } from '../models/Board';
import { Cell } from '../models/Cell';
import { Colors } from '../models/Colors';
import { FigureNames } from '../models/figures/Figure';
import { Player } from '../models/Player';
import { CellComponent } from './CellComponent';
import castlingSound from '../assets/sounds/castle.mp3';
import capturingSound from '../assets/sounds/capture.mp3';
import movingSound from '../assets/sounds/move-self.mp3';
import checkSound from '../assets/sounds/move-check.mp3';

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayers: () => void;
  isPuzzle: boolean;
  nominateWinnerByMate: (color: Colors) => void;
  nominateDrawByStaleMate: () => void;
  indicatePromotedPawn: (cell: Cell) => void;
  startTimer: () => void;
  isRotated: boolean;
}


export const BoardComponent: FC<BoardProps> = ({board, setBoard, currentPlayer, isRotated, startTimer, nominateWinnerByMate,  nominateDrawByStaleMate, indicatePromotedPawn, swapPlayers}) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const castlingAudio = useRef(new Audio(castlingSound));
  const captureAudio = useRef(new Audio(capturingSound));
  const movingAudio = useRef(new Audio(movingSound));
  const checkAudio = useRef(new Audio(checkSound));

  const highLightCells = () => {
    board.highLightCells(selectedCell);
    updateBoard();
  };

  const handleClick = (cell: Cell) => {
    if(selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
      const movingType = selectedCell.moveFigure(cell);
      switch(movingType) {
        case 'check':
          checkAudio.current.play();
          break;
        case "castling":
          castlingAudio.current.play();
          break;
        case "capturing":
          captureAudio.current.play();
          break;
        default:
          movingAudio.current.play();
      }
      startTimer();
      const color = (cell.figure && cell.figure.color === Colors.WHITE) ? Colors.BLACK : Colors.WHITE;
      if(cell.figure?.name === FigureNames.PAWN && ((cell.y === 0 && cell.figure.color === Colors.WHITE) || (cell.y === 7 && cell.figure.color === Colors.BLACK))) {
        indicatePromotedPawn(cell);
      }
      if(cell.isMate(color) && cell.figure && cell.figure.color) {
        nominateWinnerByMate(cell.figure?.color);
        return;
      }
      if(board.isStalemate(color)) {
        nominateDrawByStaleMate();
        return;
      }
      swapPlayers();
      setSelectedCell(null);
    } else {
      if(cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
    }
  }

  useEffect(() => {
    highLightCells();
  }, [selectedCell])

  function updateBoard() {
    const newBoard = board.copyBoard();
    setBoard(newBoard)
  }

  return (
    <div className="board-container">
      <div className={["board", isRotated ? "rotated" : ""].join(' ')}>
        {board.cells.map((row, index) =>
          <React.Fragment key={index}>
            {row.map(cell =>
              <CellComponent
                handleClick={handleClick}
                cell={cell}
                key={cell.id}
                selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
