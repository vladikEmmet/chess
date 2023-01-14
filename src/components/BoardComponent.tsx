import React, { FC, useState, useEffect } from 'react';
import { Board } from '../models/Board';
import { Cell } from '../models/Cell';
import { Colors } from '../models/Colors';
import { FigureNames } from '../models/figures/Figure';
import { Player } from '../models/Player';
import { CellComponent } from './CellComponent';

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayers: () => void;
  isPuzzle: boolean;
  nominateWinnerByMate: (color: Colors) => void;
  indicatePromotedPawn: (cell: Cell) => void;
  startTimer: () => void;
}


export const BoardComponent: FC<BoardProps> = ({board, setBoard, currentPlayer, startTimer, nominateWinnerByMate, indicatePromotedPawn, swapPlayers}) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null); 
  const curColor = currentPlayer?.color ? currentPlayer?.color.slice(0, 1).toUpperCase() + currentPlayer?.color.slice(1) : ""
  
  function handleClick(cell: Cell) {
    if(selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
      selectedCell.moveFigure(cell);
      startTimer();
      const color = (cell.figure && cell.figure.color === Colors.WHITE) ? Colors.BLACK : Colors.WHITE;
      if(cell.figure?.name === FigureNames.PAWN && ((cell.y === 0 && cell.figure.color === Colors.WHITE) || (cell.y === 7 && cell.figure.color === Colors.BLACK))) {
        indicatePromotedPawn(cell);
      }
      if(cell.isMate(color) && cell.figure && cell.figure.color) {
        nominateWinnerByMate(cell.figure?.color);
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
    highLightCells()
  }, [selectedCell])

  function highLightCells() {
    board.highLightCells(selectedCell)
    updateBoard()
  }

  function updateBoard() {
    const newBoard = board.copyBoard();
    setBoard(newBoard)
  }
  
  return (
    <div className="board-container">
      <h3>{curColor} to move</h3>
      <div className="board">
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