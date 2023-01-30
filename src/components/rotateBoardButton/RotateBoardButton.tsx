import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsSpin } from "@fortawesome/free-solid-svg-icons"
import styles from "./RotateBoardButton.module.css"

interface RotateBoardButtonProps {
    onClick: () => void;
}

const RotateBoardButton = ({onClick}: RotateBoardButtonProps) => {
  return (
    <div className={styles["rotate-board-container"]} onClick={onClick}>
        <FontAwesomeIcon icon={faArrowsSpin} className={styles["rotate-board-icon"]}/>
    </div>
  )
}

export default RotateBoardButton