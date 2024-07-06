import { Cell } from "./Cell";
import { Colors } from "./Colors";
import { Bishop } from "./figures/Bishop";
import { Figure, FigureNames } from "./figures/Figure";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";
const _ = require('lodash');

export class Board {
    cells: Cell[][] = [];
    lostBlackFigures: Figure[] = [];
    lostWhiteFigures: Figure[] = [];
    public winner: string | null = null;
    public isBlackKingUnderAttack: boolean = false;
    public isWhiteKingUnderAttack: boolean = false;
    public name: string = 'originalBoard';

    public initCells() {
        for(let i = 0; i < 8; i++) {
            const row: Cell[] = [];
            for(let j = 0; j < 8; j++) {
                if((i + j) % 2 !== 0) {
                    row.push(new Cell(this, j, i, Colors.BLACK, null))
                } else {
                    row.push(new Cell(this, j, i, Colors.WHITE, null))
                }
            }

            this.cells.push(row);
        }
    }

    public createStartPosition(fen: Array<string[]>) {
        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j ++) {
                if(fen[i][j].length <= 0) continue;
                let color: Colors;
                const cell = fen[i][j];
                if(cell === cell.toLowerCase()) {
                    color = Colors.BLACK;
                } else {
                    color = Colors.WHITE;
                }
                const figure = cell.toLowerCase();
                switch(figure) {
                    case "r":
                        new Rook(color, this.getCell(j, i), false);
                        break;
                    case "n":
                        new Knight(color, this.getCell(j, i));
                        break;
                    case "b":
                        new Bishop(color, this.getCell(j, i));
                        break;
                    case "q":
                        new Queen(color, this.getCell(j, i));
                        break;
                    case "k":
                        const isFirstStep = (i === 4 && (color === Colors.WHITE ? j === 7 : j === 0));
                        new King(color, this.getCell(j, i), isFirstStep);
                        break;
                    case "p":
                        new Pawn(color, this.getCell(j, i), color === Colors.WHITE ? i === 6 : i === 1);
                        break;
                }
            }
        }
    }

    public getDeepCopy() {
        return _.cloneDeep(this);
    }

    public highLightCells(selectedCell: Cell | null) {
        for(let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                target.available = !!selectedCell?.figure?.canMove(target);
            }
        }
    }

    public makeComputerMove(figureName: string, target: Cell, color: Colors) {
        for(let row = 0; row < 8; row++) {
            for(let col = 0; col < 8; col++) {
                const cell = this.getCell(col, row);
                if(cell.figure && cell.figure.name === figureName && cell.figure.color !== color && cell.figure.canMove(target)) {
                    return cell.moveFigure(target);
                }
            }
        }
    }

    public makePawnMove(column: number, color: Colors, target: Cell) {
        for(let row = 0; row < 8; row++) {
            const cell = this.getCell(column, row);
            if(cell.figure && cell.figure.color === color && cell.figure.canMove(target)) {
                cell.moveFigure(target);
            }
        }
    }

    public copyBoard(): Board {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        newBoard.isBlackKingUnderAttack = this.isBlackKingUnderAttack;
        newBoard.isWhiteKingUnderAttack = this.isWhiteKingUnderAttack;
        return newBoard;
    }

    public isStalemate(color: Colors) {
        if(this.isBlackKingUnderAttack || this.isBlackKingUnderAttack) return false;
        const king = this.cells[0][0].findKing(color);
        if(!king || !king.figure) return false;
        if(((this.cells[king.y][king.x + 1] && this.getCell(king.x + 1, king.y).isEmpty() && !king.isCellUnderAttack(king.board.getCell(king.x + 1, king.y), king.figure.color)) ||
            (this.cells[king.y][king.x - 1] && this.getCell(king.x - 1, king.y).isEmpty() && !king.isCellUnderAttack(king.board.getCell(king.x - 1, king.y), king.figure.color)) ||
            (this.cells[king.y + 1] && this.getCell(king.x, king.y + 1).isEmpty() && !king.isCellUnderAttack(king.board.getCell(king.x, king.y + 1), king.figure.color)) ||
            (this.cells[king.y - 1] && this.getCell(king.x, king.y - 1).isEmpty() && !king.isCellUnderAttack(king.board.getCell(king.x, king.y - 1), king.figure.color)) ||
            (this.cells[king.y + 1] && this.cells[king.y + 1][king.x + 1] && this.getCell(king.x + 1, king.y + 1).isEmpty() && !king.isCellUnderAttack(this.getCell(king.x + 1, king.y + 1), king.figure.color)) ||
            (this.cells[king.y - 1] && this.cells[king.y - 1][king.x + 1] && this.getCell(king.x + 1, king.y - 1).isEmpty() && !king.isCellUnderAttack(this.getCell(king.x + 1, king.y - 1), king.figure.color)) ||
            (this.cells[king.y + 1] && this.cells[king.y + 1][king.x - 1] && this.getCell(king.x - 1, king.y + 1).isEmpty() && !king.isCellUnderAttack(this.getCell(king.x - 1, king.y + 1), king.figure.color)) ||
            (this.cells[king.y - 1] && this.cells[king.y - 1][king.x - 1] && this.getCell(king.x - 1, king.y - 1).isEmpty() && !king.isCellUnderAttack(this.getCell(king.x - 1, king.y - 1), king.figure.color)))) {
                return false;
        }
        for(const row of this.cells) {
            for(const cell of row) {
                if(cell.figure && cell.figure.color === color && cell.figure.name !== FigureNames.KING) return false;
            }
        }

        return true;
    }

    public getCell(x: number, y: number) {
        return this.cells[y][x];
    }

    private addPawns() {
        for(let i = 0; i < 8; i++) {
            new Pawn(Colors.BLACK, this.getCell(i, 1), true)
            new Pawn(Colors.WHITE, this.getCell(i, 6), true)
        }
    }

    private addKings() {
        new King(Colors.WHITE, this.getCell(4, 7), true)
        new King(Colors.BLACK, this.getCell(4, 0), true)
    }

    private addQueens() {
        new Queen(Colors.WHITE, this.getCell(3, 7))
        new Queen(Colors.BLACK, this.getCell(3, 0))
    }

    private addBishops() {
        new Bishop(Colors.WHITE, this.getCell(2, 7))
        new Bishop(Colors.BLACK, this.getCell(2, 0))
        new Bishop(Colors.WHITE, this.getCell(5, 7))
        new Bishop(Colors.BLACK, this.getCell(5, 0))
    }

    private addKnights() {
        new Knight(Colors.WHITE, this.getCell(1, 7))
        new Knight(Colors.BLACK, this.getCell(1, 0))
        new Knight(Colors.WHITE, this.getCell(6, 7))
        new Knight(Colors.BLACK, this.getCell(6, 0))
    }

    private addRooks() {
        new Rook(Colors.WHITE, this.getCell(0, 7), true)
        new Rook(Colors.BLACK, this.getCell(0, 0), true)
        new Rook(Colors.WHITE, this.getCell(7, 7), true)
        new Rook(Colors.BLACK, this.getCell(7, 0), true)
    }

    public changePawnToRook(color: Colors, cell: Cell) {
        new Rook(color, cell, false);
    }

    public changePawnToQueen(color: Colors, cell: Cell) {
        new Queen(color, cell);
    }

    public changePawnToKnight(color: Colors, cell: Cell) {
        new Knight(color, cell);
    }

    public changePawnToBishop(color: Colors, cell: Cell) {
        new Bishop(color, cell);
    }

    public addFigures() {
        this.addPawns()
        this.addKings()
        this.addQueens()
        this.addRooks()
        this.addKnights()
        this.addBishops()
    }

    private addKingsFisher() {
        const x = Math.floor((Math.random() * 6) + 1);
        new King(Colors.WHITE, this.getCell(x, 7), true);
        new King(Colors.BLACK, this.getCell(x, 0), true);
    }

    private addRooksFisher() {
        const king = this.cells[0][0].findKing(Colors.WHITE);
        if(!king) return;
        const left = king.x - 1;
        const right = 7 - king.x;
        const leftRooks = Math.floor(Math.random() * left);
        const rightRooks = Math.floor((Math.random() * right) + king.x + 1);
        new Rook(Colors.WHITE, this.getCell(leftRooks, 7), true);
        new Rook(Colors.BLACK, this.getCell(leftRooks, 0), true);
        new Rook(Colors.WHITE, this.getCell(rightRooks, 7), true);
        new Rook(Colors.BLACK, this.getCell(rightRooks, 0), true);
    }

    private addKnightsFisher() {
        let i = 0;
        while(i < 2) {
            const pos = Math.floor(Math.random() * 7);
            if(this.getCell(pos, 0).isEmpty()) {
                new Knight(Colors.WHITE, this.getCell(pos, 7));
                new Knight(Colors.BLACK, this.getCell(pos, 0));
                i += 1;
            }
        }
    }

    private addBishopsFisher() {
        let i = 0;
        while(i < 2) {
            const pos = Math.floor(Math.random() * 7);
            if(this.getCell(pos, 0).isEmpty()) {
                new Bishop(Colors.WHITE, this.getCell(pos, 7));
                new Bishop(Colors.BLACK, this.getCell(pos, 0));
                i += 1;
            }
        }
    }

    private addQueensFisher() {
        for(let i = 0; i < 8; i++) {
            if(this.getCell(i, 0).isEmpty()) {
                new Queen(Colors.WHITE, this.getCell(i, 7));
                new Queen(Colors.BLACK, this.getCell(i, 0));
                break;
            }
        }
    }

    public addFisherFigures() {
        this.addKingsFisher();
        this.addRooksFisher();
        this.addKnightsFisher();
        this.addBishopsFisher();
        this.addQueensFisher();
        this.addPawns();
    }
}