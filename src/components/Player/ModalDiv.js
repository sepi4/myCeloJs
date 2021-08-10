import React from 'react'
import Modal from 'react-modal'
import moment from 'moment'
import styled from 'styled-components'

import getText from '../../functions/getText'

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

function ModalDiv({
    modal,
    setModal,
    settings,
    game,
    tableHeader,
    tableBody,
}) {
    const lg = settings && settings.language ? settings.language : 'en'
    return (
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
                <StyledLabel>
                    {getText('game_start_time', settings)}:
                </StyledLabel>
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

    )
}
export default ModalDiv