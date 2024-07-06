import { Cell } from '../Cell';
import { Colors } from '../Colors';
import {Figure, FigureNames, FigureValues} from './Figure';
import blackLogo from '../../assets/black-rook.png';
import whiteLogo from '../../assets/white-rook.png';

export class Rook extends Figure {

    constructor(color: Colors, cell: Cell, isFirstStep: boolean) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.ROOK;
        this.isFirstStep = isFirstStep;
        this.value = FigureValues.ROOK;
    }

    canMove(target: Cell): boolean {
        if(!super.canMove(target)) return false;
        if(this.cell.isEmptyVertical(target)) return true;
        if(this.cell.isEmptyHorizontal(target)) return true;
        return false;
    }

    moveFigure(target: Cell): void {
        super.moveFigure(target)
        this.isFirstStep = false;
    }
}