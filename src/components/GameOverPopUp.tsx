import React, {FC} from 'react'

export interface IGameInfo {
    result: string;
    winner: string | null;
    reason: string;
}

interface GameOverPopUpProps {
    visibility: boolean;
    info: IGameInfo;
    goBack: () => void;
}

const GameOverPopUp: FC<GameOverPopUpProps> = ({visibility, info, goBack}) => {
    return (
        <div className={["popup-container", visibility ? "active" : ""].join(' ')}>
            <h1 className="popup-result">
                {info.winner ? `${info.winner[0].toUpperCase() + info.winner.slice(1)} ${info.result}` : info.result}
            </h1>
            <h2 className='popup-reason'>
                {info.reason}
            </h2>
            <button onClick={goBack}>Go back</button>
        </div> 
    )
}

export default GameOverPopUp