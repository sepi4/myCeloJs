import { getFactionById } from '../../functions/factionMappings'
import { getExtraInfo } from '../../functions/getExtraInfo'
import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import getText from '../../functions/getText'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { useViewStore } from '../../stores/viewStore'
import { MatchHistoryReportResult, NormalizedProfiles, SettingsType } from '../../types'
import styles from './ModalTableHeaders.module.css'

interface Props {
    settings: SettingsType
    players: MatchHistoryReportResult[]
    profiles: NormalizedProfiles
}

function ModalTableHeaders(props: Props) {
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

                {props.players.map((p) => (
                    <th key={p.profile_id} className={styles.th}>
                        <img
                            src={getFactionFlagLocation(getFactionById(p.race_id))}
                            alt={`${getFactionById(p.race_id)}`}
                        />
                    </th>
                ))}
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
                    return (
                        <th
                            key={p.profile_id}
                            className={styles.th}
                            style={{
                                color:
                                    p.resulttype === 1
                                        ? 'green'
                                        : p.resulttype === 0
                                          ? 'red'
                                          : 'blue',
                                cursor: 'pointer',
                            }}
                        >
                            <a
                                title={props.profiles[p.profile_id].alias}
                                onClick={async () => {
                                    const x = await getExtraInfo(coh3, [p.profile_id])
                                    if (!x) {
                                        return
                                    }
                                    const pro = props.profiles[p.profile_id]
                                    const newPlayer = {
                                        country: pro.country,
                                        name: pro.alias,
                                        profileId: pro.profile_id,
                                    }
                                    if (!newPlayer.profileId) {
                                        return
                                    }
                                    const ex = x.result[newPlayer.profileId]
                                    if (ex) {
                                        setPlayerCard(newPlayer, ex)
                                        setView('playerCard')
                                    }
                                }}
                            >
                                {props.profiles[p.profile_id].alias}
                            </a>
                        </th>
                    )
                })}
            </tr>
        </thead>
    )
}
export default ModalTableHeaders
