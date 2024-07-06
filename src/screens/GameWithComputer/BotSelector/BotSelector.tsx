import {ChangeEvent, FC} from 'react'
import type { AvailableBots, InitialisedBot } from '../../../engines/Bots'
import styles from "./BotSelector.module.css"

type SelectedBot = {
    name: string;
    move: InitialisedBot;
} | null;

interface BotSelectorProps {
  playerName: string;
  availableBots: AvailableBots;
  selectedBot: SelectedBot;
  setSelectedBot: (bot: SelectedBot) => void;
  disabled: boolean;
}

const BotSelector: FC<BotSelectorProps> = ({ playerName, availableBots, selectedBot, setSelectedBot, disabled }) => {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        const name = e.target.value;
        setSelectedBot(name ? { name, move: availableBots[name]() } : null);
      };
    
      return (
        <div className={styles.botSelector}>
          <label>{playerName}</label>
          <select value={selectedBot?.name} onChange={handleChange} disabled={disabled}>
            <option value="" key="User">
              User
            </option>
            {Object.keys(availableBots).map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
      );
}

export default BotSelector