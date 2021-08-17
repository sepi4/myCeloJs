
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import PlayerExtraInfo from '../Player/PlayerExtraInfo'
import Icon from './Icon'

import { faTimes, } from '@fortawesome/free-solid-svg-icons'
import styles from './PlayerCard.module.css'

import logo_coh2 from '../../../img/logo_coh2.png'
import logo_coh2stats from '../../../img/logo_coh2stats.png'

import getSiteLink from '../../functions/getSiteLink'

import { shell } from 'electron'

export default function PlayerCard() {
    const dispatch = useDispatch()
    const state = useSelector(state => state)
    const countryFlags = state.countryFlags

    const handlePlayerCardOff = () => {
        dispatch({
            type: 'PLAYER_CARD_OFF',
        })
    }

    // esc button close player card
    function escPressed(e) {
        if (e.key === 'Escape') {
            handlePlayerCardOff()
        }
    }
    useEffect(() => {
        window.addEventListener('keydown', escPressed);

        return () => {
            window.removeEventListener('keydown', escPressed);
        }
    })

    // SEARCH
    // const baseUrl = "https://coh2-api.reliclink.com"
    // const getPlayerSearchUrl = (name: string): string => {
    //     return encodeURI(baseUrl + `/community/leaderboard/GetPersonalStat?title=coh2&search=${name}`);
    // }

    let player = state.playerCard.player
    let extraInfo = state.extraInfo

    extraInfo = extraInfo && player.profileId
        ? extraInfo[player.profileId]
        : null

    const card = (
        state && state.playerCard && state.extraInfo
            ? <PlayerExtraInfo
                player={player}
                extraInfo={extraInfo}
            />
            : null
    )

    const steamId = state.extraInfo[player.profileId].steamId

    const linkCoh2stats = getSiteLink('coh2stats.com') + steamId
    const funCoh2stats = () => steamId ? shell.openExternal(linkCoh2stats) : null

    const linkCoh2 = getSiteLink('coh2.org') + steamId
    const funCoh2 = () => steamId ? shell.openExternal(linkCoh2) : null

    return (
        <>
            <div className={styles.container}>
                <Icon
                    fun={handlePlayerCardOff}
                    icon={faTimes}
                />

                <div className={styles.nameDiv}>
                    <img
                        src={countryFlags[player.country]}
                        alt={`${player.country}`}
                        title={`${player.country}`}
                    />
                    <span>{player.name}</span>
                </div>


                <div className={styles.info}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={styles.label}>steam id:</th>
                                <td>{steamId}</td>
                            </tr>
                            <tr>
                                <th className={styles.label}>profile id:</th>
                                <td>{player.profileId}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className={styles.links}>
                    <img
                        src={logo_coh2stats}
                        alt='coh2stats'
                        title='coh2stats.com'
                        onClick={funCoh2stats}
                    />
                    <img
                        src={logo_coh2}
                        alt='coh2'
                        title='coh2.org'
                        onClick={funCoh2}
                    />
                </div>

                {card}
            </div>
        </>
    )
}
