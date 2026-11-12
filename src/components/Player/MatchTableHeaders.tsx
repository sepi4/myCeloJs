import { getFactionCodeByRaceId, getFactionFlag } from '../../constants/games'
import { useDisplayGame } from '../../hooks/useDisplayGame'
import useOpenPlayerCard from '../../hooks/useOpenPlayerCard'
import useText from '../../hooks/useText'
import { MatchHistoryReportResult, NormalizedProfiles } from '../../types'
import PlayerName from '../PlayerName'

import styles from './MatchTableHeaders.module.css'

interface Props {
    players: MatchHistoryReportResult[]
    profiles: NormalizedProfiles
}

function MatchTableHeaders(props: Props) {
    const getText = useText()
    const game = useDisplayGame()
    const openPlayerCard = useOpenPlayerCard()
    return (
        <thead>
            <tr>
                <th className={styles.rowLabel}>{getText('faction')}</th>

                {props.players.map((p) => {
                    const factionCode = getFactionCodeByRaceId(game, p.race_id)
                    const factionFlag = getFactionFlag(game, factionCode)
                    return (
                        <th key={p.profile_id} className={styles.th}>
                            <img src={factionFlag} alt={factionCode} />
                        </th>
                    )
                })}
            </tr>

            <tr>
                <th className={styles.rowLabel}>{getText('name')}</th>
                {props.players.map((p) => {
                    const pro = props.profiles[p.profile_id]
                    return (
                        <th
                            key={p.profile_id}
                            className={styles.th}
                            style={{
                                color:
                                    p.resulttype === 1
                                        ? 'var(--accent-positive)'
                                        : p.resulttype === 0
                                          ? 'var(--accent-negative)'
                                          : 'var(--accent-neutral)',
                                cursor: 'pointer',
                            }}
                        >
                            <a
                                data-testid="game-details-player"
                                title={pro?.alias ?? `${p.profile_id}`}
                                onClick={() =>
                                    openPlayerCard({
                                        country: pro?.country,
                                        name: pro?.alias ?? `${p.profile_id}`,
                                        profileId: p.profile_id,
                                    })
                                }
                            >
                                <PlayerName name={pro?.alias ?? `${p.profile_id}`} />
                            </a>
                        </th>
                    )
                })}
            </tr>
        </thead>
    )
}
export default MatchTableHeaders
