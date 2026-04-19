import { getFactionCodeCoh2ById, getFactionCodeCoh3ById } from '../../constants/factionMappings'
import { getExtraInfo } from '../../functions/api/getExtraInfo'
import {
    getFactionFlagLocation,
    getFactionFlagLocationCoh3,
} from '../../functions/utils/getFactionFlagLocation'
import getText from '../../functions/utils/getText'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { useViewStore } from '../../stores/viewStore'
import { MatchHistoryReportResult, NormalizedProfiles, SettingsType } from '../../types'
import styles from './MatchTableHeaders.module.css'

interface Props {
    settings: SettingsType
    players: MatchHistoryReportResult[]
    profiles: NormalizedProfiles
}

function MatchTableHeaders(props: Props) {
    const {
        navButtons: { coh3 },
    } = useNavButtonsStore()
    const { setPlayerCard } = usePlayerCardStore()
    const { setView } = useViewStore()
    return (
        <thead>
            <tr>
                <th className={styles.th} style={{ textAlign: 'left' }}>
                    {getText('faction', props.settings)}
                </th>

                {props.players.map((p) => {
                    const factionCode = coh3
                        ? getFactionCodeCoh3ById(p.race_id)
                        : getFactionCodeCoh2ById(p.race_id)
                    const factionFlag = coh3
                        ? getFactionFlagLocationCoh3(factionCode)
                        : getFactionFlagLocation(factionCode)
                    return (
                        <th key={p.profile_id} className={styles.th}>
                            <img src={factionFlag} alt={factionCode} />
                        </th>
                    )
                })}
            </tr>

            <tr>
                <th
                    className={styles.th}
                    style={{
                        textAlign: 'left',
                    }}
                >
                    {getText('name', props.settings)}
                </th>
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
                                title={pro?.alias ?? `${p.profile_id}`}
                                onClick={async () => {
                                    const x = await getExtraInfo(coh3, [p.profile_id])
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
                                        setPlayerCard(newPlayer, ex, coh3)
                                        setView('playerCard')
                                    }
                                }}
                            >
                                {pro?.alias ?? `${p.profile_id}`}
                            </a>
                        </th>
                    )
                })}
            </tr>
        </thead>
    )
}
export default MatchTableHeaders
