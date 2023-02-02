import { Board } from "./Board";
import { Colors } from "./Colors";
import { Figure, FigureNames } from "./figures/Figure";

export class Cell {
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    figure: Figure | null;
    board: Board;
    available: boolean;
    id: number;

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
       this.x = x;
       this.y = y;
       this.color = color;
       this.figure = figure;
       this.board = board;
       this.available = false;
       this.id = Math.random(); 
    }

    isCellUnderAttack(target: Cell, color: Colors): boolean {
        for(const row of this.board.cells) {
            for(const cell of row) {
                if(cell.figure && cell.figure.color !== color && cell.figure.name !== FigureNames.KING && cell.figure.name !== FigureNames.PAWN && cell.figure.canMove(target)) {
                    return true;
                }
                if(cell.figure && cell.figure.color !== color && cell.figure.name === FigureNames.PAWN) {
                    const dir = cell.figure.color === Colors.BLACK ? 1 : -1;
                    if((target.x === cell.x + 1 || target.x === cell.x - 1) && target.y === cell.y + dir) return true;
                }
            }
        }

        return false;
    }

    isMate(color: Colors) {
        const findAttacker = (king: Cell) => {
            for(const row of this.board.cells) {
                for(const cell of row) {
                    if(cell.figure && cell.figure.canMove(king)) return cell;
                }
            }
        }

        const tmp = this.findKing(color);
        
        if(!tmp || !tmp.figure) return;

        const king = this.board.getCell(tmp.x, tmp.y);

        if(!king || !king.figure) return;
        
        const attacker = findAttacker(king);
        if(!attacker || ! attacker.figure) return false;
        if(king.figure.canMove(attacker)) return false;

        if(((this.board.cells[king.y][king.x + 1] && this.board.getCell(king.x + 1, king.y).isEmpty() && !this.isCellUnderAttack(this.board.getCell(king.x + 1, king.y), king.figure.color)) ||
            (this.board.cells[king.y][king.x - 1] && this.board.getCell(king.x - 1, king.y).isEmpty() && !this.isCellUnderAttack(this.board.getCell(king.x - 1, king.y), king.figure.color)) ||
            (this.board.cells[king.y + 1] && this.board.getCell(king.x, king.y + 1).isEmpty() && !this.isCellUnderAttack(this.board.getCell(king.x, king.y + 1), king.figure.color)) ||
            (this.board.cells[king.y - 1] && this.board.getCell(king.x, king.y - 1).isEmpty() && !this.isCellUnderAttack(this.board.getCell(king.x, king.y - 1), king.figure.color)) ||
            (this.board.cells[king.y + 1] && this.board.cells[king.y + 1][king.x + 1] && this.board.getCell(king.x + 1, king.y + 1).isEmpty() && !this.isCellUnderAttack(this.board.getCell(king.x + 1, king.y + 1), king.figure.color)) ||
            (this.board.cells[king.y - 1] && this.board.cells[king.y - 1][king.x + 1] && this.board.getCell(king.x + 1, king.y - 1).isEmpty() && !this.isCellUnderAttack(this.board.getCell(king.x + 1, king.y - 1), king.figure.color)) ||
            (this.board.cells[king.y + 1] && this.board.cells[king.y + 1][king.x - 1] && this.board.getCell(king.x - 1, king.y + 1).isEmpty() && !this.isCellUnderAttack(this.board.getCell(king.x - 1, king.y + 1), king.figure.color)) ||
            (this.board.cells[king.y - 1] && this.board.cells[king.y - 1][king.x - 1] && this.board.getCell(king.x - 1, king.y - 1).isEmpty() && !this.isCellUnderAttack(this.board.getCell(king.x - 1, king.y - 1), king.figure.color)))) {
                return false;
        }
        
        if(attacker?.figure?.name === FigureNames.KNIGHT && !this.isCellUnderAttack(attacker, attacker.figure.color)) {
            return true;
        }

        if(attacker.y === king.y) return king.checkHorizontal(attacker);
        
        if(attacker.x === king.x) return king.checkVertical(attacker);
        
        return king.checkDiagonal(attacker);
        
        
    }
    
    findKing(color: Colors): Cell | void {
        for(const row of this.board.cells) {
            for(const cell of row) {
                if(cell.figure && cell.figure.name === FigureNames.KING && cell.figure.color === color) {
                    return cell;
                }
            }
        }
    }
    
    isKingUnderAttack(color: Colors): boolean {
        const king = this.findKing(color);
        
        if(king && this.isCellUnderAttack(king, color)) {
            return true;
        }
        return false;
    }

    isSaveMove(start: Cell, target: Cell): boolean {
        const clone = this.board.getDeepCopy();
        clone.name = "auxiliaryBoard";
        const cell = clone.getCell(start.x, start.y);
        const kingColor = cell.figure?.color;

        clone.getCell(target.x, target.y).setFigure(cell.figure);
        cell.figure = null;
    

        if(kingColor === Colors.WHITE && cell.isKingUnderAttack.call(cell, Colors.WHITE)) return false;
        if(kingColor === Colors.BLACK && cell.isKingUnderAttack.call(cell, Colors.BLACK)) return false;
        return true;
    }
    
    isEmpty(): boolean {
        return this.figure === null;
    }

    isEnemy(target: Cell): boolean {
        if(target.figure) {
            return this.figure?.color !== target.figure.color;
        }

        return false;
    }

    checkHorizontal(target: Cell) {
        const min = Math.min(this.x, target.x);
        const max = Math.max(this.x, target.x);

        for(let x = min + 1; x < max; x++) {
            if(this.isCellUnderAttack(this.board.getCell(x, this.y), this.color)) return false;
        }
        return true;
    }
    
    checkVertical(target: Cell) {
        const min = Math.min(this.y, target.y);
        const max = Math.max(this.y, target.y);

        for(let y = min + 1; y < max; y++) {
            if(this.isCellUnderAttack(this.board.getCell(this.x, y), this.color)) return false;
        }
        return true;
    }

    checkDiagonal(target: Cell) {
        const X = Math.abs(target.x - this.x);
        const Y = Math.abs(target.y - this.y);
        if(X !== Y) return false;

        const dy = this.y < target.y ? 1 : -1;
        const dx = this.x < target.x ? 1 : -1;

        for(let i = 1; i < Y; i++) {
            if(this.isCellUnderAttack(this.board.getCell(this.x + dx * i, this.y + dy * i), this.color)) return false;
        }

        return true;
    }
    
    isEmptyVerical(target: Cell): boolean {
        if(this.x !== target.x) {
            return false;
        }

        const min = Math.min(this.y, target.y);
        const max = Math.max(this.y, target.y);
        for (let y = min + 1; y < max; y++) {
            if(!this.board.getCell(this.x, y).isEmpty()) {
                return false;
            }
        }

        return true;

        
    }

    isEmptyHorizontal(target: Cell): boolean {
        if(this.y !== target.y) {
            return false;
        }

        const min = Math.min(this.x, target.x);
        const max = Math.max(this.x, target.x);
        for (let x = min + 1; x < max; x++) {
            if(!this.board.getCell(x, this.y).isEmpty()) {
                return false;
            }
        }

        return true;

    }

    isEmptyDiagonal(target: Cell): boolean {
        const X = Math.abs(target.x - this.x);
        const Y = Math.abs(target.y - this.y);
        if(X !== Y) return false;

        const dy = this.y < target.y ? 1 : -1;
        const dx = this.x < target.x ? 1 : -1;

        for(let i = 1; i < Y; i++) {
            if(!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) return false;
        }

        return true;
    }

    setFigure(figure: Figure) {
        this.figure = figure;
        this.figure.cell = this;
    }
    
    addLostFigure(figure: Figure | null) {
        console.log(figure);
        if(!figure) return;
        figure.color === Colors.BLACK
            ? this.board.lostBlackFigures.push(figure)
            : this.board.lostWhiteFigures.push(figure)
    }
    
    moveFigure(target: Cell) {
        const color = this.figure?.color
        if(this.figure && this.figure?.canMove(target)) {
            this.figure.moveFigure(target)
            if(target.figure) {
                this.addLostFigure(target.figure);
            }
            target.setFigure(this.figure);
            this.figure = null;
        }

        if(color === Colors.WHITE) {
            this.board.isBlackKingUnderAttack = this.isKingUnderAttack(Colors.BLACK);
            this.board.winner = this.isMate(Colors.BLACK) ? "Black" : null;
        }
        if(color === Colors.BLACK) {
            this.board.isWhiteKingUnderAttack = this.isKingUnderAttack(Colors.WHITE);
            this.board.winner = this.isMate(Colors.WHITE) ? "White" : null;
        }
    }

    longCastling(target: Cell) {
        if(this.figure) {
            this.figure.isFirstStep = false;
            target.setFigure(this.figure);
            this.figure = null;
        }
    }

    shortCastling(target: Cell) {
        if(this.figure) {
            this.figure.isFirstStep = false;
            target.setFigure(this.figure);
            this.figure = null;
        }
    }
}