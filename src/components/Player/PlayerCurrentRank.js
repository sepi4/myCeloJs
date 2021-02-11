import React from 'react'
import { useSelector } from 'react-redux'

import { shell } from 'electron'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown, } from '@fortawesome/free-solid-svg-icons'

const Span = styled.span`
    width: ${({width}) => width};
    display: flex;
    align-items: center;
    justify-content: ${({justifyContent}) => justifyContent 
        ? justifyContent
        : 'center'
    };
    color: white;
    font-weight: bold;
`

function PlayerCurrentRank({
    player,
    img,
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
        <Span 
            width='20%'
            justifyContent='flex-start'
        >
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
        </Span>

        {/* faction flag */}
        <Span width='15%'>{img}</Span>

        {/* country flag */}
        <Span width='15%'>
            {country !== undefined 
                ? <img
                    style={{
                        height: '1.2em',
                    }}
                    src={countryFlagLocation}
                    alt={country}
                    title={country}
                />
                : null
            }
        </Span>

        {/* nickname */}
        <Span
            width='50%'
            style={steamId ? {  cursor: 'pointer' } : null}
            onClick={() => (steamId ? shell.openExternal(link) : null)}
        >
            {player.name}
        </Span>
    </div>
}

export default PlayerCurrentRank