/* eslint-disable indent */
import React from 'react'
import styled from 'styled-components'

import { shell } from 'electron'
import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { getFactionById } from '../../functions/simpleFunctions'
import getSiteLink from '../../functions/getSiteLink'
import getText from '../../functions/getText'
import {
    MatchHistoryReportResult,
    NormalizedProfiles,
    SettingsType,
} from '../../types'

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
    console.log('players', props.players)
    return (
        <thead>
            <tr>
                <StyledTh style={{ textAlign: 'left' }}>
                    {getText('faction', props.settings)}
                </StyledTh>

                {props.players.map((p) => (
                    <StyledTh key={p.profile_id} len={props.players.length}>
                        <img
                            // className={styles.factionImg}
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
                    const steamId =
                        props.profiles[p.profile_id].name.substring(7)
                    const link = getSiteLink(props.settings.siteLink) + steamId

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
                                onClick={() =>
                                    steamId ? shell.openExternal(link) : null
                                }
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
