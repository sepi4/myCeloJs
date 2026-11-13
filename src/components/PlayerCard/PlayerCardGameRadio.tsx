import { GAMES } from '../../constants/games'
import useText from '../../hooks/useText'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import Choice from '../Choice'

import styles from './PlayerCard.module.css'

export default function PlayerCardGameRadio() {
    const getText = useText()
    const { selectedGame, otherGameLoading, otherGameChecked, otherPlayer, setSelectedGame } =
        usePlayerCardStore()

    const otherAvailable = otherGameChecked && otherPlayer !== null
    const noProfileTitle =
        otherGameChecked && !otherPlayer ? getText('no_profile_for_game') : undefined

    return (
        <div className={styles.gameRadio}>
            {GAMES.map((game) => {
                const selected = game === selectedGame
                return (
                    <Choice
                        key={game}
                        type="radio"
                        testId={`player-card-radio-${game}`}
                        name="player-card-game"
                        label={game}
                        checked={selected}
                        disabled={!selected && (otherGameLoading || !otherAvailable)}
                        onChange={() => setSelectedGame(game)}
                        title={selected ? undefined : noProfileTitle}
                    />
                )
            })}
        </div>
    )
}
