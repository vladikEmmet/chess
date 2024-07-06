import React, {FC, useEffect, useState} from 'react'
import { Board } from '../models/Board';
import { Cell } from '../models/Cell';
import { Colors } from '../models/Colors';
import { FigureNames } from '../models/figures/Figure';
import { CellComponent } from './CellComponent';

interface PuzzleBoardComponentProps {
    board: Board;
    setBoard: (board: Board) => void;
    title: string;
    playersColor: Colors | null;
    indicatePromotedPawn: (cell: Cell) => void;
    pgnArr: string[];
    createWarningWindow: () => void;
    removePgnElement: () => void;
    showCongrats: () => void;
}

interface IFigures {
  [index: string]: string;
}

const PuzzleBoardComponent: FC<PuzzleBoardComponentProps> = ({board, setBoard, pgnArr, playersColor, createWarningWindow, removePgnElement, showCongrats, indicatePromotedPawn, title,}) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [columns] = useState(["a", "b", "c", "d", "e", "f", "g", "h"]);
    const [figures] = useState<IFigures>({
      "Q": FigureNames.QUEEN,
      "K": FigureNames.KING,
      "R": FigureNames.ROOK,
      "N": FigureNames.KNIGHT,
      "B": FigureNames.BISHOP,
      "P": FigureNames.PAWN,
    })

    const highLightCells = () => {
      board.highLightCells(selectedCell);
      updateBoard();
    };

    function handleClick(cell: Cell) {
        try {
            if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
                selectedCell.moveFigure(cell);
                if (cell.figure?.name === FigureNames.PAWN && ((cell.y === 0 && cell.figure.color === Colors.WHITE) || (cell.y === 7 && cell.figure.color === Colors.BLACK))) {
                    indicatePromotedPawn(cell);
                }
                setSelectedCell(null);

                if (!isValidMove(cell)) {
                    createWarningWindow();
                    return;
                }

                if (pgnArr[0].trim().split(' ').length <= 1) {
                    showCongrats();
                    return;
                }

                setTimeout(() => {
                    makeComputerMove(playersColor || Colors.WHITE);
                    removePgnElement();
                }, 500);


            } else {
                if (cell.figure?.color === playersColor) {
                    setSelectedCell(cell);
                }
            }
        } catch (e) {
            alert("Failed to process your move. But we tried. Reload the page and try again");
            console.log(e);
        }
    }


    function makeComputerMove(color: Colors) {
      if(pgnArr[0].split(' ').length <= 1) return;

      const move = pgnArr[0].split(' ')[1].trim();
      const tmp = move.split('').find(i => i === i.toUpperCase() && i.match(/[A-Z]/) && move[move.indexOf(i) - 1] !== "=");
      if(!tmp) {
        movePawn();
        return;
      }
      const figureName = figures[tmp];

      const y = move.split('').find(i => !isNaN(+i));
      if(!y) return;
      const x = move[move.indexOf(y) - 1];

      const cell = board.getCell(columns.indexOf(x), 8 - +y);
      board.makeComputerMove(figureName, cell, color);

      function movePawn() {
        const col = columns.indexOf(move[0]);
        const row = move.includes('x') ? +move[move.indexOf('x') + 2] : +move[1];
        const target = board.getCell(columns.indexOf(move[move.indexOf('x') + 1]), 8 - row);
        const color = playersColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
        board.makePawnMove(col, color, target);

        if(move.includes('=') && ( (color === Colors.WHITE && (8 - row) === 0) ||  (color === Colors.BLACK && (8 - row) === 7) )) {
          const figureToChange = move[move.indexOf('=') + 1];
          switch(figureToChange) {
            case "R":
              board.changePawnToRook(color, target);
              break;
            case "N":
              board.changePawnToKnight(color, target);
              break;
            case "B":
              board.changePawnToBishop(color, target);
              break;
            case "Q":
            default:
              board.changePawnToQueen(color, target);
              break;
          }
        }
      }

    }


    function isValidMove(cell: Cell) {

      const playersMove = pgnArr[0].split(' ')[0].replaceAll(/\s|\*|#/g, "");
      const tmp = playersMove.split('').find(i => i === i.toUpperCase() && i.match(/[A-Z]/) && playersMove[playersMove.indexOf(i) - 1] !== "=");

      if(!tmp) {
        if(cell.figure?.name !== FigureNames.PAWN) return false;
        if(playersMove.includes('x')) {
          const col = columns.indexOf(playersMove[playersMove.indexOf('x') - 1]);
          return board.getCell(col, cell.figure.color === Colors.WHITE ? cell.y + 1 : cell.y - 1).isEmpty();
        }
        const col = playersMove[0];
        return board.getCell(columns.indexOf(col), cell.figure.color === Colors.WHITE ? cell.y + 1 : cell.y - 1).isEmpty();
      }

      const row = playersMove.split('').find(i => !isNaN(+i));
      if(!row) return false;
      if(8 - cell.y !== +row) return false;

      const col = playersMove[playersMove.indexOf(row) - 1];
      if(!col) return false;

      return cell.x === columns.indexOf(col);
    }

    useEffect(() => {
      highLightCells()
    }, [selectedCell])

    function updateBoard() {
      const newBoard = board.copyBoard();
      setBoard(newBoard)
    }

    return (
    <div>
      <h1 className="puzzle-title">{title}</h1>
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
      <h4 className="puzzle-api-info">Thanks <a href="https://www.chess.com/">chess.com</a> for their API</h4>
    </div>
    )
}

export default PuzzleBoardComponent;

