import { Cell } from '../Cell';
import { Colors } from '../Colors';
import {Figure, FigureNames} from './Figure';
import blackLogo from '../../assets/black-king.png';
import whiteLogo from '../../assets/white-king.png';

export class King extends Figure {

      
    constructor(color: Colors, cell: Cell, isFirstStep: boolean) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.KING;
        this.isFirstStep = isFirstStep;
    }

    canMove(target: Cell): boolean {
        if(!super.canMove(target)) return false;
        if(this.cell.isCellUnderAttack(target, this.color)) return false;
        if((target.x === this.cell.x) 
            && (target.y === this.cell.y + 1 || target.y === this.cell.y - 1)) {
                return true;
        }
        if((target.y === this.cell.y)
            && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)) {
                return true;
        }
        if((target.y === this.cell.y + 1 || target.y === this.cell.y - 1)
            && (target.x === this.cell.x + 1 || target.x === this.cell.x -1)) {
                return true;
        }

        const shortRookCell = this.cell.board.getCell(this.cell.x + 3, this.cell.y);

        if(target.y === this.cell.y 
            && target.x === this.cell.x + 2
            && !this.cell.isCellUnderAttack(target, this.color)
            && !this.cell.isCellUnderAttack(this.cell.board.getCell(target.x - 1, target.y), this.color)
            && this.cell.board.getCell(this.cell.x + 1, this.cell.y).isEmpty()
            && this.cell.board.getCell(target.x, target.y).isEmpty()
            && shortRookCell?.figure?.name === FigureNames.ROOK
            && shortRookCell?.figure?.isFirstStep
            && this.isFirstStep) {
                
                return true;
        }

        const longRookCell = this.cell.board.getCell(this.cell.x - 4, this.cell.y);

        if(target.y === this.cell.y
                && target.x === this.cell.x - 2
                && !this.cell.isCellUnderAttack(target, this.color)
                && !this.cell.isCellUnderAttack(this.cell.board.getCell(target.x + 1, target.y), this.color)
                && this.cell.board.getCell(this.cell.x - 1, this.cell.y).isEmpty()
                && this.cell.board.getCell(target.x, target.y).isEmpty()
                && longRookCell?.figure?.name === FigureNames.ROOK
                && longRookCell?.figure?.isFirstStep
                && this.isFirstStep) {
                    
                    return true;
            }

        return false;
    }

    moveFigure(target: Cell): void {
        if(target.x === this.cell.x - 2 && target.y === this.cell.y) {
            super.moveFigure(target);
            const longRook = this.cell.board.getCell(this.cell.x - 4, this.cell.y);
            const newRookPos = this.cell.board.getCell(this.cell.x - 1, this.cell.y);
            longRook.longCastling(newRookPos);
            this.isFirstStep = false;
            return;
        }

        if(target.x === this.cell.x + 2 && target.y === this.cell.y) {
            super.moveFigure(target);
            const shortRook = this.cell.board.getCell(this.cell.x + 3, this.cell.y);
            const newRookPos = this.cell.board.getCell(this.cell.x + 1, this.cell.y);
            shortRook.shortCastling(newRookPos);
            this.isFirstStep = false;
            return;
        }
        
        super.moveFigure(target);
        this.isFirstStep = false;
    }
    
}