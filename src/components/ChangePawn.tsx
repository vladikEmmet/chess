import React, {FC} from 'react'
import blackBishop from '../assets/black-bishop.png';
import whiteBishop from '../assets/white-bishop.png';
import blackRook from '../assets/black-rook.png';
import whiteRook from '../assets/white-rook.png';
import blackQueen from '../assets/black-queen.png';
import whiteQueen from '../assets/white-queen.png';
import blackKnight from '../assets/black-knight.png';
import whiteKnight from '../assets/white-knight.png';
import { Colors } from '../models/Colors';
import { Cell } from '../models/Cell';
import { Board } from '../models/Board';

interface ChangePawnProps {
    color: Colors | undefined;
    promotedPawn: Cell;
    board: Board;
    handleClick: () => void;
    selectFigure?: () => void;
}


const ChangePawn: FC<ChangePawnProps> = ({color, promotedPawn, board, handleClick}) => {
    const figures = color === Colors.WHITE ? [whiteBishop, whiteKnight, whiteQueen, whiteRook] : [blackBishop, blackKnight, blackQueen, blackRook];

  return (
    <div className="change-pawn-container" onClick={(e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLImageElement;
        if(!target) return;
        const color = promotedPawn.figure?.color || Colors.WHITE;
        const cell = board.getCell(promotedPawn.x, promotedPawn.y);
        board.getCell(promotedPawn.x, promotedPawn.y).figure = null;
        switch(target.src) {
            case whiteBishop:
            case blackBishop:
                board.changePawnToBishop(color, cell);
                break;
            case whiteRook:
            case blackRook:
                board.changePawnToRook(color, cell);
                break;
            case whiteKnight:
            case blackKnight:
                board.changePawnToKnight(color, cell);
                break;
            case whiteQueen:
            case blackQueen:
            default:
                board.changePawnToQueen(color, cell);
                break;
        }
        handleClick();
    }}>
        <div className="change-pawn-list">
            {figures.map(figure => 
                <img src={figure} alt="" className="change-pawn-figure" key={figure}/>
            )}
        </div>
    </div>
  )
}

export default ChangePawn