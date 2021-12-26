import React from 'react'

import styles from './PlayerMainRow.module.css'

import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { commonName } from '../../functions/simpleFunctions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'

import countriesJson from '../../../countries.json'

import MainRowSpan from './MainRowSpan'

import { getTotalGames } from '../../functions/simpleFunctions'

import { ExtraInfo, Player } from '../../types'
import { useAppDispatch, useAppSelector } from '../../hooks/customReduxHooks'

const countries = countriesJson as {
    [key: string]: {
        name: string
        'alpha-2': string
        'alpha-3': string
        'country-code': string
        'iso_3166-2': string
        region: string
        'sub-region': string
        'intermediate-region': string
        'region-code': string
        'sub-region-code': string
        'intermediate-region-code': string
    }
}

interface Props {
    player: Player
    extraInfo: ExtraInfo | null
    showExtra: boolean
    handleSetShowExtra: () => void
}

function PlayerMainRow(props: Props) {
    const { player, handleSetShowExtra, extraInfo, showExtra } = props
    let country: string | undefined
    let steamId: string | undefined

    if (extraInfo && player.profileId) {
        for (const rank of extraInfo.ranks) {
            if (!rank.members) {
                continue
            }

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

    const dispatch = useAppDispatch()

    const handlePlayerCardOn = () => {
        dispatch({
            type: 'PLAYER_CARD_ON',
            data: {
                player,
                extraInfo,
            },
        })
    }

    const countryFlagLocation = useAppSelector(
        (state) => state.countryFlags[country ? country : '']
    )

    const dropDownArrow = (
        <span style={{ width: '2em' }}>
            {Number(player.profileId) > 0 && (
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
                title={countries[country] ? countries[country]['name'] : ''}
            />
        ) : null

    const alias = (
        <span
            style={{ cursor: steamId ? 'pointer' : undefined }}
            title={
                extraInfo && player.profileId
                    ? getTotalGames(extraInfo) + ' games played'
                    : ''
            }
            onClick={handlePlayerCardOn}
        >
            {player.name}
        </span>
    )

    return (
        <div className={styles.container}>
            <MainRowSpan width="20%" justifyContent="flex-start">
                <>
                    {dropDownArrow} {rank}
                </>
            </MainRowSpan>
            <MainRowSpan width="15%">{faction}</MainRowSpan>
            <MainRowSpan width="15%">{countryFlag}</MainRowSpan>
            <MainRowSpan width="50%">{alias}</MainRowSpan>
        </div>
    )
}

export default PlayerMainRow
