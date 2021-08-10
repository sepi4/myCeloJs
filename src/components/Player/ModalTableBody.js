import React from 'react'
import styled from 'styled-components'

import getText from '../../functions/getText'

const StyledTr = styled.tr`
    text-align: center;
    &:hover {
        background-color: rgb(38, 38, 38);
    }
`

function ModalTableBody({
    game,
    settings,
    players,
}) {
    const styleTd = {
        overflow: 'hidden',
        fontSize: '75%',
        width: 99 / 9 + '%',
    }

    return (
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
}

export default ModalTableBody