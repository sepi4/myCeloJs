import React from 'react'
import { useSelector } from 'react-redux'

import { shell } from 'electron'
import styled from 'styled-components'

import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { commonName } from '../../functions/simpleFunctions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown, } from '@fortawesome/free-solid-svg-icons'

import countries from '../../../countries.json'

const StyledSpan = styled.span`
    width: ${({width}) => width};
    display: flex;
    align-items: center;
    justify-content: ${({justifyContent}) => justifyContent 
        ? justifyContent
        : 'center'
    };
    color: #ddd;
    font-weight: bold;
`

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
        <img
            style={{
                width: '2em',
                height: '2em',
            }}
            src={getFactionFlagLocation(commonName(player.faction))}
            alt={`${player.faction}`}
        />
    )

    const link =
        'http://www.companyofheroes.com/'
        + 'leaderboards#profile/steam/'
        + steamId
        + '/standings'

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
        <StyledSpan 
            width='20%'
            justifyContent='flex-start'
        >
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
                : Number(player.ranking)
            }
        </StyledSpan>

        <StyledSpan width='15%' >
            <span title={commonName(player.faction)} >
                {factionImage}
            </span>
        </StyledSpan>

        <StyledSpan width='15%'>
            {country !== undefined 
                ? <img
                    style={{
                        height: '1.2em',
                    }}
                    src={countryFlagLocation}
                    alt={country}
                    title={countries[country] ? countries[country]['name'] : null}
                />
                : null
            }
        </StyledSpan>

        <StyledSpan
            width='50%'
            onClick={() => (steamId ? shell.openExternal(link) : null)}
        >
            <span 
                style={{ cursor: steamId ? 'pointer' : null, }} 
                title={
                    extraInfo && player.profileId
                        ? getTotalGames(player) + ' games played'
                        : null
                }
            >
                {player.name}
            </span>
        </StyledSpan>
    </div>
}

export default PlayerMainRow