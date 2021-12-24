import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import styles from './PlayerMainRow.module.css'

import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { commonName } from '../../functions/simpleFunctions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'

import countries from '../../../countries.json'

import MainRowSpan from './MainRowSpan'

import { getTotalGames } from '../../functions/simpleFunctions'

// import { shell } from 'electron'
// import getSiteLink from '../../functions/getSiteLink'
// import worldIcon from '../../../img/world.png'

function PlayerMainRow({ player, handleSetShowExtra, extraInfo, showExtra }) {
    let country
    let steamId
    if (extraInfo && player.profileId) {
        for (const rank of extraInfo.ranks) {
            for (const member of rank.members) {
                if (member.profile_id == player.profileId) {
                    country = member.country
                    steamId = member.name.substring(7)
                    break
                }
            }
            if (country) {
                break
            }
        }
    }

    // const settings = useSelector(state => state.settings)
    // const link = getSiteLink(settings.siteLink) + steamId
    const dispatch = useDispatch()

    const handlePlayerCardOn = () => {
        dispatch({
            type: 'PLAYER_CARD_ON',
            data: {
                player,
                extraInfo,
            },
        })
    }

    const countryFlagLocation = useSelector(
        (state) => state.countryFlags[country]
    )

    // const getTotalGames = () => {
    //     let sum = 0
    //     for (const rankObj of extraInfo.ranks) {
    //         sum += rankObj.wins + rankObj.losses
    //     }
    //     return sum
    // }

    const dropDownArrow = (
        <span style={{ width: '2em' }}>
            {+player.profileId > 0 && (
                <FontAwesomeIcon
                    icon={showExtra ? faCaretDown : faCaretRight}
                    size="lg"
                    style={{
                        color: '#ddd',
                        cursor: 'pointer',
                    }}
                    onClick={extraInfo ? handleSetShowExtra : undefined}
                />
            )}
        </span>
    )
    // const rank = player.ranking === '-1' || player.ranking === -1
    //     ? '-'
    //     : player.ranking

    const teamMarker = player.teamMarker ? player.teamMarker : ''

    const rank = (player.ranking === -1 ? '-' : player.ranking) + teamMarker

    const faction = (
        <span title={commonName(player.faction)}>
            <img
                className={styles.factionFlag}
                src={getFactionFlagLocation(commonName(player.faction))}
                alt={`${player.faction}`}
            />
        </span>
    )

    const countryFlag =
        country !== undefined ? (
            <img
                style={{
                    height: '1.2em',
                }}
                src={countryFlagLocation}
                alt={country}
                title={countries[country] ? countries[country]['name'] : null}
            />
        ) : null

    const alias = (
        <span
            style={{ cursor: steamId ? 'pointer' : null }}
            title={
                extraInfo && player.profileId
                    ? getTotalGames(extraInfo) + ' games played'
                    : null
            }
            onClick={handlePlayerCardOn}
        >
            {player.name}
        </span>
    )

    return (
        <div className={styles.container}>
            <MainRowSpan width="20%" justifyContent="flex-start">
                {dropDownArrow} {rank}
            </MainRowSpan>

            <MainRowSpan width="15%">{faction}</MainRowSpan>

            <MainRowSpan width="15%">{countryFlag}</MainRowSpan>

            <MainRowSpan width="50%">{alias}</MainRowSpan>

            {/* 
        <MainRowSpan width='10%'>
            {webIcon}
        </MainRowSpan> */}
        </div>
    )
}

export default PlayerMainRow
