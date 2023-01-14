import {FC} from 'react'
import { Cell } from '../models/Cell'

interface CellProps {
  cell: Cell;
  selected: boolean;
  handleClick: (cell: Cell) => void
}

export const CellComponent: FC<CellProps> = ({cell, selected, handleClick}) => {
  return (
    <div 
      onClick={() => handleClick(cell)} 
      className={["cell", cell.color, selected ? "selected" : ""].join(' ')}
      style={{background: cell.available && cell.figure ? "orange" : ""}}
    >
        {cell.available && !cell.figure && <div className="available"></div>}
        {cell.figure?.logo && <img src={cell.figure.logo} alt="" />}
    </div>
  )
}
