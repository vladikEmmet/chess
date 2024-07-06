import { Cell } from '../Cell';
import { Colors } from '../Colors';
import {Figure, FigureNames, FigureValues} from './Figure';
import blackLogo from '../../assets/black-pawn.png';
import whiteLogo from '../../assets/white-pawn.png';

export class Pawn extends Figure {
    constructor(color: Colors, cell: Cell, isFirstStep: boolean) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.PAWN;
        this.value = FigureValues.PAWN;
        this.isFirstStep = isFirstStep;
        this.canBeTakenOnPass = false;
    }

    canMove(target: Cell): boolean {
        if(!super.canMove(target)) return false;
        const dir = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
        const firstStepDir = this.cell.figure?.color === Colors.BLACK ? 2 : -2;

        if(((target.y === this.cell.y + dir)
                || (this.isFirstStep && (target.y === this.cell.y + firstStepDir) && (this.cell.board.getCell(target.x, target.y - dir).isEmpty())))
                && target.x === this.cell.x
                && this.cell.board.getCell(target.x, target.y).isEmpty()) {
                    return true;
                }

        if(target.y === this.cell.y + dir
            && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)
            && this.cell.isEnemy(target)) {
                return true;
            }

        if(target.y === this.cell.y + dir && target.x === this.cell.x + 1
            && this.cell.board.getCell(target.x, target.y).isEmpty()
            && this.cell.board.getCell(this.cell.x + 1, this.cell.y).figure?.name === FigureNames.PAWN
            && this.cell.board.getCell(this.cell.x + 1, this.cell.y).figure?.color !== this.color
            && this.cell.board.getCell(this.cell.x + 1, this.cell.y).figure?.canBeTakenOnPass) {
                return true;
        }

        if(target.y === this.cell.y + dir && target.x === this.cell.x - 1
            && this.cell.board.getCell(target.x, target.y).isEmpty()
            && this.cell.board.getCell(this.cell.x - 1, this.cell.y).figure?.name === FigureNames.PAWN
            && this.cell.board.getCell(this.cell.x - 1, this.cell.y).figure?.color !== this.color
            && this.cell.board.getCell(this.cell.x - 1, this.cell.y).figure?.canBeTakenOnPass) {
                return true;
            }

        return false;
    }

    moveFigure(target: Cell): void | string {
        const firstStepDir = this.cell.figure?.color === Colors.BLACK ? 2 : -2;
        this.canBeTakenOnPass = (this.cell.y + firstStepDir === target.y && this.isFirstStep);

        if(target.x === this.cell.x + 1
            && this.cell.board.getCell(target.x, target.y).isEmpty()
            && this.cell.board.getCell(this.cell.x + 1, this.cell.y).figure?.name === FigureNames.PAWN
            && this.cell.board.getCell(this.cell.x + 1, this.cell.y).figure?.color !== this.color
            && this.cell.board.getCell(this.cell.x + 1, this.cell.y).figure?.canBeTakenOnPass) {
                this.cell.addLostFigure(this.cell.board.getCell(this.cell.x + 1, this.cell.y).figure)
                this.cell.board.getCell(this.cell.x + 1, this.cell.y).figure = null;
                super.moveFigure(target);
                return;
        }

        if(target.x === this.cell.x - 1
            && this.cell.board.getCell(target.x, target.y).isEmpty()
            && this.cell.board.getCell(this.cell.x - 1, this.cell.y).figure?.name === FigureNames.PAWN
            && this.cell.board.getCell(this.cell.x - 1, this.cell.y).figure?.color !== this.color
            && this.cell.board.getCell(this.cell.x - 1, this.cell.y).figure?.canBeTakenOnPass) {
                this.cell.addLostFigure(this.cell.board.getCell(this.cell.x - 1, this.cell.y).figure)
                this.cell.board.getCell(this.cell.x - 1, this.cell.y).figure = null;
                super.moveFigure(target);
                return;
            }

        super.moveFigure(target);
        this.isFirstStep = false;
    }
}