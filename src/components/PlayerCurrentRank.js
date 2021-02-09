import React from 'react'
import { useSelector } from 'react-redux'

import { shell } from 'electron'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown, } from '@fortawesome/free-solid-svg-icons'

function PlayerCurrentRank({
    style,
    player,
    img,
    handleSetShowExtra,
    showExtra,
    extraInfo,
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

    const link =
        'http://www.companyofheroes.com/'
        + 'leaderboards#profile/steam/'
        + steamId
        + '/standings'

    const countryFlagLocation = useSelector(
        state => state.countryFlags[country]
    )

    return <div style={{
        display: 'flex',
        alignItems: 'center',
    }}>
        {/* ranking number */}
        <span style={style}>

            <FontAwesomeIcon 
                icon={showExtra ? faCaretDown : faCaretRight} 
                size='lg'
                style={{ 
                    color: 'white',
                    marginRight: '1em',
                    cursor: 'pointer',
                }} 
                onClick={extraInfo ? handleSetShowExtra: undefined}
            />

            {player.ranking === '-1' || player.ranking === -1
                ? '-'
                : Number(player.ranking)
            }
        </span>

        {/* faction flag */}
        <span style={style}>{img}</span>

        {/* country flag */}
        <span style={style}>
            {country !== undefined ? (
                <img
                    style={{
                        height: '1.2em',
                    }}
                    src={countryFlagLocation}
                    alt={country}
                    title={country}
                />
            ) : null}
        </span>

        {/* nickname */}
        <span
            style={steamId ? { ...style, cursor: 'pointer' } : { ...style }}
            onClick={() => (steamId ? shell.openExternal(link) : null)}
        >
            {player.name}
        </span>
    </div>
}

export default PlayerCurrentRank