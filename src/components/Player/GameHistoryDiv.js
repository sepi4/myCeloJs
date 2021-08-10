import React, { useState } from 'react'
import moment from 'moment'
import { shell } from 'electron'
import { useSelector } from 'react-redux'
import getText from '../../functions/getText'

import ModalDiv from './ModalDiv'

import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { getFactionById } from '../../functions/simpleFunctions'

import styled from 'styled-components'
import getSiteLink from '../../functions/getSiteLink'

const StyledTr = styled.tr`
    text-align: center;
    &:hover {
        background-color: rgb(38, 38, 38);
    }
`

const StyledTh = styled.th`
    word-wrap: break-word;
    max-width: ${({ len }) => 99 / (len + 1)} + '%';
`

export default function GameHistoryDiv({ game, profiles }) {
    const [modal, setModal] = useState(false)
    const settings = useSelector(state => state.settings)
    const lg = settings && settings.language ? settings.language : 'en'

    let backgroundColor = 'blue'
    if (game.result.resulttype === 1) {
        backgroundColor = 'green'
    }
    if (game.result.resulttype === 0) {
        backgroundColor = 'red'
    }

    const players = game.players.sort((a, b) => b.teamid - a.teamid)

    const tableHeader = (
        <thead>
            <tr>
                <StyledTh
                    style={{
                        textAlign: 'left',
                    }}
                >
                    {getText('faction', settings)}
                </StyledTh>

                {players.map((p) => (
                    <StyledTh key={p.profile_id} len={players.length}>
                        <img
                            style={{
                                width: '1.4em',
                                height: '1.4em',
                            }}
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
    console.log('players:', players)

    const styleTd = {
        overflow: 'hidden',
        fontSize: '75%',
        width: 99 / 9 + '%',
    }

    const tableBody = (
        <tbody>
            {Object.keys(game.counters)
                .sort((a, b) => (a > b ? 1 : -1))
                .filter(k => getText(k, settings) !== undefined)
                // .filter(k => text[k] !== undefined)
                .map((k, i) => (
                    <StyledTr key={`${k} ${i}`}>
                        <td
                            style={{
                                ...styleTd,
                                fontWeight: 'bold',
                                color: 'gray',
                                textAlign: 'left',
                            }}
                        >
                            {/* {k} */}
                            {getText(k, settings)}
                        </td>

                        {players.map((p) => (
                            <td style={styleTd} key={`${p.profile_id} ${i}`}>
                                {p.counters[k]}
                            </td>
                        ))}
                    </StyledTr>
                ))}
        </tbody>
    )

    const matchType = game.matchType ? game.matchType.name : '???'
    const timeAgo = moment(game.endGameTime).locale(lg).fromNow()

    const defaultStyle = {
        overflow: 'hidden',
        height: '2em',
        margin: '0',
        flex: '1 1 8em',
    }

    let playersNames = ''
    players.forEach((p, i) => {
        if (i !== 0 && players.length / i === 2) {
            playersNames += '\t----- vs -----\t\n'
        }
        playersNames += profiles[p.profile_id].alias + '\n'
    })

    return (
        <>
            <div
                title={playersNames}
                style={{
                    ...defaultStyle,
                    border: '.1em solid ' + backgroundColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    cursor: 'pointer',
                    margin: '0.2em',

                }}
                onClick={() => {
                    setModal(true)
                }}
            >
                <img
                    style={{
                        width: '1.4em',
                        height: '1.4em',
                    }}
                    src={getFactionFlagLocation(
                        getFactionById(game.result.race_id),
                    )}
                    alt={`${getFactionById(game.result.race_id)}`}
                />

                <div
                    style={{
                        fontSize: '70%',
                        width: '70%',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <div>{matchType}</div>
                    <div>{timeAgo}</div>
                </div>
            </div>

            <ModalDiv
                modal={modal}
                setModal={setModal}
                game={game}
                settings={settings}
                tableHeader={tableHeader}
                tableBody={tableBody}
            />

        </>
    )
}
