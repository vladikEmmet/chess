import {FC, useEffect} from 'react'
import { Figure } from '../../models/figures/Figure'
import styles from "./LostFigures.module.css";

interface LostFiguresProps {
    figures: Figure[];
    addValue: (total: number) => void;
    diff: number;
    className?: "top" | "bottom";
}

const LostFigures: FC<LostFiguresProps> = ({figures, addValue, diff, className}) => {
  useEffect(() => addValue(figures.reduce((total, figure) => total += figure.value, 0)))

  return (
    <div className={`${styles.lost} ${className}`}>
        {figures.map(figure =>
            <div key={figure.id}>
                {figure.logo && <img style={{width: 40, height: 40}} src={figure.logo} alt="Losted Figure"/>}
            </div>
        )}
        {diff > 0 && <div className={styles.difference}>+{diff}</div>}
    </div>
  )
}

export default LostFigures