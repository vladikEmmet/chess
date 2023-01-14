import React, {FC, useEffect} from 'react'
import { Figure } from '../models/figures/Figure'

interface LostFiguresProps {
    figures: Figure[];
    addValue: (total: number) => void;
    diff: number;
}

const LostFigures: FC<LostFiguresProps> = ({figures, addValue, diff}) => {
  useEffect(() => addValue(figures.reduce((total, figure) => total += figure.value, 0)))
  
  return (
    <div className="lost">
        {figures.map(figure => 
            <div key={figure.id}>
                {figure.logo && <img style={{width: 40, height: 40}} src={figure.logo} alt="Losted Figure"/>}
            </div>    
        )}
        {diff > 0 && <div className="difference">+{diff}</div>}
    </div>
  )
}

export default LostFigures