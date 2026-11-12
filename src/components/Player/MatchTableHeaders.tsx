import { getFactionCodeByRaceId, getFactionFlag } from '../../constants/games'
import { getExtraInfo } from '../../functions/api/getExtraInfo'
import getText from '../../functions/utils/getText'
import { useDisplayGame } from '../../hooks/useDisplayGame'
import { useNavigationStore } from '../../stores/navigationStore'
import { MatchHistoryReportResult, NormalizedProfiles, SettingsType } from '../../types'
import PlayerName from '../PlayerName'

import styles from './MatchTableHeaders.module.css'

interface Props {
    settings: SettingsType | null
    players: MatchHistoryReportResult[]
    profiles: NormalizedProfiles
}

function MatchTableHeaders(props: Props) {
    const game = useDisplayGame()
    const openPlayerCard = useNavigationStore((s) => s.openPlayerCard)
    return (
        <thead>
            <tr>
                <th className={styles.rowLabel}>{getText('faction', props.settings)}</th>

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
                <th className={styles.rowLabel}>{getText('name', props.settings)}</th>
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
                                onClick={async () => {
                                    const x = await getExtraInfo(game, [p.profile_id])
                                    if (!x) {
                                        return
                                    }
                                    const newPlayer = {
                                        country: pro?.country,
                                        name: pro?.alias ?? `${p.profile_id}`,
                                        profileId: p.profile_id,
                                    }
                                    if (!newPlayer.profileId) {
                                        return
                                    }
                                    const ex = x.result[newPlayer.profileId]
                                    if (ex) {
                                        openPlayerCard(newPlayer, ex, game)
                                    }
                                }}
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
