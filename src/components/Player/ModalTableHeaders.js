import React from 'react'
import styled from 'styled-components'

import { shell } from 'electron'
import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { getFactionById } from '../../functions/simpleFunctions'
import getSiteLink from '../../functions/getSiteLink'
import getText from '../../functions/getText'


const StyledTh = styled.th`
    word-wrap: break-word;
    max-width: ${({ len }) => 99 / (len + 1)} + '%';
    img {
        width: 1.4em;
        height: 1.4em;
    }
`

function ModalTableHeaders({
    settings,
    players,
    profiles,
}) {
    return (
        <thead>
            <tr>
                <StyledTh style={{ textAlign: 'left' }} >
                    {getText('faction', settings)}
                </StyledTh>

                {players.map((p) => (
                    <StyledTh key={p.profile_id} len={players.length}>
                        <img
                            // className={styles.factionImg}
                            src={getFactionFlagLocation(
                                getFactionById(p.race_id),
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
                    {getText('name', settings)}
                </StyledTh>
                {players.map((p) => {
                    const steamId = profiles[p.profile_id].name.substring(7)
                    const link = getSiteLink(settings.siteLink) + steamId

                    return <StyledTh
                        key={p.profile_id}
                        len={players.length}
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
                            title={profiles[p.profile_id].alias}
                            onClick={() => (steamId
                                ? shell.openExternal(link)
                                : null)
                            }
                        >
                            {profiles[p.profile_id].alias}
                        </a>

                    </StyledTh>
                })}
            </tr>
        </thead>

    )
}
export default ModalTableHeaders