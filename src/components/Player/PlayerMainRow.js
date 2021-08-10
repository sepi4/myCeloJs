import React from 'react'
import { useSelector } from 'react-redux'

import { shell } from 'electron'
import styles from './PlayerMainRow.module.css'

import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { commonName } from '../../functions/simpleFunctions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown, } from '@fortawesome/free-solid-svg-icons'

import countries from '../../../countries.json'

import getSiteLink from '../../functions/getSiteLink'
import MainRowSpan from './MainRowSpan'

function PlayerMainRow({
    player,
    handleSetShowExtra,
    extraInfo,
    showExtra,
}) {
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

    const factionImage = (
        <img className={styles.factionFlag}
            src={getFactionFlagLocation(commonName(player.faction))}
            alt={`${player.faction}`}
        />
    )

    const settings = useSelector(state => state.settings)
    const link = getSiteLink(settings.siteLink) + steamId

    const countryFlagLocation = useSelector(
        state => state.countryFlags[country]
    )

    const getTotalGames = () => {
        let sum = 0
        for (const rankObj of extraInfo.ranks) {
            sum += rankObj.wins + rankObj.losses
        }
        return sum
    }

    return <div style={{
        display: 'flex',
        alignItems: 'center',
    }}>
        <MainRowSpan width='20%' justifyContent='flex-start' >
            <span style={{ width: '2em', }} >
                {+player.profileId > 0 && <FontAwesomeIcon
                    icon={showExtra ? faCaretDown : faCaretRight}
                    size='lg'
                    style={{
                        color: '#ddd',
                        cursor: 'pointer',
                    }}
                    onClick={extraInfo ? handleSetShowExtra : undefined}
                />
                }
            </span>

            {player.ranking === '-1' || player.ranking === -1
                ? '-'
                : player.ranking // Number(player.ranking)
            }
        </MainRowSpan>

        <MainRowSpan width='15%' >
            <span title={commonName(player.faction)} >
                {factionImage}
            </span>
        </MainRowSpan>

        <MainRowSpan width='15%' >
            {country !== undefined
                ? <img
                    style={{
                        height: '1.2em',
                    }}
                    src={countryFlagLocation}
                    alt={country}
                    title={countries[country]
                        ? countries[country]['name']
                        : null
                    }
                />
                : null
            }
        </MainRowSpan>

        <MainRowSpan width='50%'>
            <span
                style={{ cursor: steamId ? 'pointer' : null, }}
                title={
                    extraInfo && player.profileId
                        ? getTotalGames(player) + ' games played'
                        : null
                }
                onClick={() => (steamId ? shell.openExternal(link) : null)}
            >
                {player.name}
            </span>
        </MainRowSpan>
    </div>
}

export default PlayerMainRow