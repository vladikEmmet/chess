import {FC, useEffect, useRef} from 'react'
import { Move } from '../../../engines/Engine'
import styles from "./History.module.css"

interface HistoryProps {
    history: Array<Move>;
}

const History: FC<HistoryProps> = ({history}) => {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      endRef.current?.scrollIntoView();
    }, [history]);
  
    return (
      <div className={styles["history-container"]}>
        <pre className={styles.history}>
          {history.map(({ color, piece, from, san }) => `${color}${piece === "p" ? "" : piece}${from} ${san}`).join('\n')}
          <div ref={endRef} />
        </pre>
      </div>
    );
}

export default History