import React, {FC} from 'react'
import { Link } from 'react-router-dom';

export interface IGameInfo {
    result: string
    winner: string | null;
    reason: string;
}

interface GameOverPopUpProps {
    visibility: boolean;
    info: IGameInfo;
}

const GameOverPopUp: FC<GameOverPopUpProps> = ({visibility, info}) => {
    return (
        <div className={["popup-container", visibility ? "active" : ""].join(' ')}>
            <h1 className="popup-result">
                {info.winner ? `${info.winner[0].toUpperCase() + info.winner.slice(1)} ${info.result}` : info.result}
            </h1>
            <h2 className='popup-reason'>
                {info.reason}
            </h2>
            <Link to="/" className="game-over-button">Go back</Link>
        </div> 
    )
}

export default GameOverPopUp