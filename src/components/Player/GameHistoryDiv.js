import React, { useState } from 'react'
import Modal from 'react-modal'
import moment from 'moment'

import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { getFactionById } from '../../functions/simpleFunctions'

import styled from 'styled-components'

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

    let backgroundColor = 'blue'
    if (game.result.resulttype === 1) {
        backgroundColor = 'green'
    }
    if (game.result.resulttype === 0) {
        backgroundColor = 'red'
    }

    const players = game.players.sort((a, b) => b.resulttype - a.resulttype)

    const tableHeader = (
        <thead>
            <tr>
                <StyledTh
                    style={{
                        textAlign: 'left',
                    }}
                >
                    faction
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
                    name
                </StyledTh>
                {players.map((p) => (
                    <StyledTh
                        key={p.profile_id}
                        len={players.length}
                        style={{
                            color:
                                p.resulttype === 1
                                    ? 'green'
                                    : p.resulttype === 0
                                        ? 'red'
                                        : 'blue',
                        }}
                    >
                        <span title={profiles[p.profile_id].alias}>
                            {profiles[p.profile_id].alias}
                        </span>
                    </StyledTh>
                ))}
            </tr>
        </thead>
    )

    const styleTd = {
        overflow: 'hidden',
        fontSize: '75%',
        width: 99 / 9 + '%',
    }

    const tableBody = (
        <tbody>
            {Object.keys(game.counters)
                .sort((a, b) => (a > b ? 1 : -1))
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
                            {k}
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
    const timeAgo = moment(game.endGameTime).fromNow()

    const defaultStyle = {
        overflow: 'hidden',
        height: '2em',
        margin: '0',
        flex: '1 1 20%',
    }
    return (
        <>
            <div
                style={{
                    ...defaultStyle,
                    // backgroundColor: backgroundColor,
                    border: '.1em solid ' + backgroundColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    cursor: 'pointer',
                    margin: '0.3em',
                }}
                onClick={() => {
                    setModal(true)
                    // console.log('game:', game)
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
                contentLabel='testi'
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
                }}
            >
                {/* <button onClick={() => setModal(false)}>Close Modal</button> */}

                <div>
                    <StyledLabel>game start time:</StyledLabel>
                    <StyledValue>
                        {moment(game.startGameTime).format('lll')}
                    </StyledValue>
                </div>
                <div>
                    <StyledLabel>game end time:</StyledLabel>
                    <StyledValue>
                        {moment(game.endGameTime).format('lll')}
                    </StyledValue>
                </div>
                <div>
                    <StyledLabel>duration:</StyledLabel>
                    <StyledValue>
                        {
                            moment.utc(moment.duration(
                                game.endGameTime.getTime()
                                - game.startGameTime.getTime()
                            ).asMilliseconds()).format("HH:mm")
                        }
                    </StyledValue>
                </div>
                <div>
                    <StyledLabel>map:</StyledLabel>
                    <StyledValue>{game.mapName}</StyledValue>
                </div>


                <StyledTable>
                    {tableHeader}
                    {tableBody}
                </StyledTable>
            </Modal>
        </>
    )
}
