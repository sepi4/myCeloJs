import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getExtraInfo } from '../../functions/getExtraInfo'
import getLastPlayedGame from '../../functions/getLastPlayedGame'
import getTotalGames from '../../functions/getTotalGames'

import searchPlayers from '../../functions/searchPlayers'
import FoundPlayer from './FoundPlayer'

import styles from './Search.module.css'

export default function Search() {
    const state = useSelector(state => state)
    const inputRef = useRef(null);

    const [searchValue, setSearchValue] = useState(null)
    const dispatch = useDispatch()

    const handleSearchInput = e => {
        setSearchValue(e.target.value)
    }

    const handleKeyUp = e => {
        if (e.key === 'Enter' && searchValue.trim().length > 0) {
            // console.log(searchValue)
            searchPlayers(searchValue, res => {
                const arrPlayers = res.map(p => {
                    return {
                        profileId: p.profile_id,
                    }
                })

                if (arrPlayers.length === 0) {
                    dispatch({
                        type: 'SET_FOUND_PLAYERS',
                        data: [],
                    })
                    return
                }

                getExtraInfo(arrPlayers, (result) => {
                    const newPlayers = res.map(p => {
                        if (result[p.profile_id]) {
                            p.totalGames = getTotalGames(result[p.profile_id])
                            p.lastGameTime = getLastPlayedGame(result[p.profile_id])
                        } else {
                            p.totalGames = 0
                        }
                        p.extraInfo = result[p.profile_id]
                        return p
                    }).sort((a, b) => b.totalGames - a.totalGames)

                    dispatch({
                        type: 'SET_FOUND_PLAYERS',
                        data: newPlayers,
                    })
                }, true)

            })
        }
    }

    const handlePlayerCardOn = (player) => {
        dispatch({
            type: 'PLAYER_CARD_ON',
            data: {
                player: {
                    ...player,
                    name: player.alias,
                    profileId: player.profile_id + '',
                    country: player.country,
                },

                // extraInfo: {
                //     ...extraInfo[player.profile_id],
                //     steamId: player.name.substring(7),
                // },

                extraInfo: {
                    ranks: player.extraInfo.ranks,
                    steamId: player.name.substring(7),
                }
            }
        })
    }

    const handle = (p) => {
        handlePlayerCardOn(p)
    }

    const foundPlayers = state.foundPlayers
    const players = (
        foundPlayers.length > 0
            ? foundPlayers.map(p => (
                <FoundPlayer
                    key={p.profile_id}
                    player={p}
                    clickFun={() => { handle(p) }}
                />
            ))
            : null
    )

    useEffect(() => {
        inputRef.current.focus()
    })

    return (
        <div className={styles.container}>
            <div className={styles.inputDiv}>
                <input
                    ref={inputRef}
                    className={styles.input}
                    placeholder='steam alias or id'
                    onChange={handleSearchInput}
                    onKeyUp={handleKeyUp}
                />
            </div>
            <div className={styles.content}>
                {players}
            </div>
        </div>
    )
}
