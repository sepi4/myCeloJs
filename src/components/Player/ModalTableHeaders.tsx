/* eslint-disable indent */
import styled from 'styled-components'

import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { getFactionById } from '../../functions/simpleFunctions'
import getText from '../../functions/getText'
import {
    MatchHistoryReportResult,
    NormalizedProfiles,
    SettingsType,
} from '../../types'
import { getExtraInfo } from '../../functions/getExtraInfo'
import { useAppDispatch, useAppSelector } from '../../hooks/customReduxHooks'

const StyledTh = styled.th`
    word-wrap: break-word;
    max-width: ${({ len }: { len?: number }) => (len ? 99 / (len + 1) : null)} +
        '%';
    img {
        width: 1.4em;
        height: 1.4em;
    }
`

interface Props {
    settings: SettingsType
    players: MatchHistoryReportResult[]
    profiles: NormalizedProfiles
}

function ModalTableHeaders(props: Props) {
    const state = useAppSelector((state) => state)
    const dispatch = useAppDispatch()
    return (
        <thead>
            <tr>
                <StyledTh style={{ textAlign: 'left' }}>
                    {getText('faction', props.settings)}
                </StyledTh>

                {props.players.map((p) => (
                    <StyledTh key={p.profile_id} len={props.players.length}>
                        <img
                            src={getFactionFlagLocation(
                                getFactionById(p.race_id)
                            )}
                            alt={`${getFactionById(p.race_id)}`}
                        />
                    </StyledTh>
                ))}
            </tr>

            <tr>
                <StyledTh
                    style={{
                        textAlign: 'left',
                    }}
                >
                    {getText('name', props.settings)}
                </StyledTh>
                {props.players.map((p) => {
                    return (
                        <StyledTh
                            key={p.profile_id}
                            len={props.players.length}
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
                                onClick={() => {
                                    getExtraInfo(
                                    state.navButtons.coh3,
                                    [p.profile_id], 
                                        (result) => {
                                        const pro = props.profiles[p.profile_id]
                                        const newPlayer = {
                                            country: pro.country,
                                            name: pro.alias,
                                            profileId: pro.profile_id,
                                        }
                                        if (!newPlayer.profileId) {
                                            return
                                        }

                                        const ex = result[newPlayer.profileId]
                                        if (result && ex) {
                                            dispatch({
                                                type: 'PLAYER_CARD_ON',
                                                data: {
                                                    player: newPlayer,
                                                    extraInfo: ex,
                                                },
                                            })
                                        }
                                    })
                                }}
                            >
                                {props.profiles[p.profile_id].alias}
                            </a>
                        </StyledTh>
                    )
                })}
            </tr>
        </thead>
    )
}
export default ModalTableHeaders
