import { Link } from 'react-router-dom'
import styles from './DecidedPuzzle.module.css'
import usePlaySound from "../../../hooks/usePlaySound";

const DecidedPuzzle = () => {
    usePlaySound();

  return (
    <div className="puzzle-popup">
        <h1>Decided!</h1>
        <Link to="/" className={styles["puzzle-back-to-menu-link"]}>Back to menu</Link>
    </div>
  )
}

export default DecidedPuzzle