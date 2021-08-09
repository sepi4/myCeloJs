import React, { useState } from 'react'
import Modal from 'react-modal'
import moment from 'moment'
import { shell } from 'electron'
import { useSelector } from 'react-redux'
import getText from '../../functions/getText'

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
const StyledLabel = styled.span`
    display: inline-block;
    color: gray;
    font-size: 90%;
    min-width: 40%;
`
const StyledValue = styled.span`
    color: yellow;
`
const StyledTable = styled.table`
    margin: 1em 0 0 0;
    table-layout: fixed;
    width: 100%;
    cursor: default;
`

export default function GameHistoryDiv({ game, profiles }) {
    const [modal, setModal] = useState(false)
    const settings = useSelector(state => state.settings)
    const lg = settings && settings.language ? settings.language : 'en'
    // const siteLink = settings ? settings.siteLink : 'coh2stats.com'

    let backgroundColor = 'blue'
    if (game.result.resulttype === 1) {
        backgroundColor = 'green'
    }
    if (game.result.resulttype === 0) {
        backgroundColor = 'red'
    }

    // const players = game.players.sort((a, b) => b.resulttype - a.resulttype)
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

                    // 'https://coh2stats.com/'
                    // + 'players/'
                    // + steamId

                    // 'https://www.coh2.org/'
                    // + 'ladders/playercard/steamid/'
                    // + steamId

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

    // console.log('lg:', lg)
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
                    // backgroundColor: backgroundColor,
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

            <Modal
                isOpen={modal}
                contentLabel='gameHistoryStats'
                ariaHideApp={false}
                shouldCloseOnOverlayClick={true}
                onRequestClose={() => setModal(false)}
                style={{
                    content: {
                        top: '0',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        margin: '5em 2em 2em 2em',
                        borderRadius: '0',
                        backgroundColor: '#181818',
                        color: '#ddd',
                    },
                    overlay: {
                        backgroundColor: 'rgba(200, 200, 200, 0.5)',
                    }

                }}
            >
                <div>
                    <StyledLabel>{getText('game_start_time', settings)}:</StyledLabel>
                    <StyledValue>
                        {moment(game.startGameTime).locale(lg).format('lll')}
                    </StyledValue>
                </div>
                <div>
                    <StyledLabel>{getText('game_end_time', settings)}:</StyledLabel>
                    <StyledValue>
                        {moment(game.endGameTime).locale(lg).format('lll')}
                    </StyledValue>
                </div>
                <div>
                    <StyledLabel>{getText('map', settings)}:</StyledLabel>
                    <StyledValue>{game.mapName}</StyledValue>
                </div>
                <div>
                    <StyledLabel>{getText('duration', settings)}:</StyledLabel>
                    <StyledValue>
                        {
                            moment.utc(moment.duration(
                                game.endGameTime.getTime()
                                - game.startGameTime.getTime()
                            ).asMilliseconds()).locale(lg).format("HH:mm:ss")
                        }
                    </StyledValue>
                </div>
                <StyledTable>
                    {tableHeader}
                    {tableBody}
                </StyledTable>
            </Modal>
        </>
    )
}
