import logo from '../../assets/black-king.png';
import { Cell } from '../Cell';
import { Colors } from "../Colors";

export enum FigureNames {
    FIGURE = "",
    KING = "King",
    KNIGHT = "Knight",
    PAWN = "Pawn",
    QUEEN = "Queen",
    ROOK = "Rook",
    BISHOP = "Bishop",
}

export enum FigureValues {
    FIGURE = 0,
    KNIGHT = 3,
    PAWN = 1,
    QUEEN = 9,
    ROOK = 5,
    BISHOP = 3,
}

export class Figure {
    color: Colors;
    logo: typeof logo | null;
    cell: Cell;
    name: FigureNames;
    id: number;
    isFirstStep?: boolean;
    canBeTakenOnPass?: boolean;
    value: number;

    constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.cell = cell;
        this.cell.figure = this;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        this.id = Math.random();
        this.value = FigureValues.FIGURE;
    }

    canMove(target: Cell) : boolean {
        if(target.figure?.color === this.color) return false
        if(this.cell.board.name === "originalBoard" && !this.cell.isSaveMove(this.cell, target)) return false
        return true;
    }
    
    moveFigure(target: Cell) {
        
    }
}