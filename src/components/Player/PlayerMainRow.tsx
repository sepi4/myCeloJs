import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import countriesJson from '../../../countries.json'
import { getCountryName } from '../../countryTranslations'
import {
    getFactionFlagLocation,
    getFactionFlagLocationCoh3,
} from '../../functions/getFactionFlagLocation'
import getText from '../../functions/getText'
import { commonName } from '../../functions/simpleFunctions'
import { getTotalGames } from '../../functions/simpleFunctions'
import { useCountryFlagsStore } from '../../stores/countryFlagsStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useViewStore } from '../../stores/viewStore'
import { ExtraInfo, Player } from '../../types'
import MainRowSpan from './MainRowSpan'
import styles from './PlayerMainRow.module.css'

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
    const {
        navButtons: { coh3 },
    } = useNavButtonsStore()
    const { settings } = useSettingsStore()
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

    const { setPlayerCard } = usePlayerCardStore()
    const { setView } = useViewStore()

    const handlePlayerCardOn = () => {
        setPlayerCard(player, extraInfo)
        setView('playerCard')
    }

    const { countryFlags } = useCountryFlagsStore()
    const countryFlagLocation = countryFlags[country ? country : '']

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
    const rank =
        (player.ranking == null || player.ranking === -1 ? '-' : player.ranking) + teamMarker

    const ranktotal =
        player.ranking && player.ranking > 0
            ? (extraInfo?.ranks.find((r) => r.rank === player.ranking)?.ranktotal ?? 0)
            : 0
    const rankTitle = ranktotal > 0 ? `${getText('of', settings)} ${ranktotal}` : ''

    const factionFlag = coh3
        ? getFactionFlagLocationCoh3(player.faction)
        : getFactionFlagLocation(commonName(player.faction))
    const factionTitle = coh3 ? player.faction : commonName(player.faction)
    const faction = (
        <span title={factionTitle}>
            <img className={styles.factionFlag} src={factionFlag} alt={player.faction} />
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
                title={
                    countries[country]
                        ? getCountryName(country, settings?.language ?? '') ||
                          countries[country]['name']
                        : ''
                }
            />
        ) : null

    const alias = (
        <span
            style={{ cursor: steamId ? 'pointer' : undefined }}
            title={
                extraInfo && player.profileId
                    ? getTotalGames(extraInfo.ranks) + ' games played'
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
                    {dropDownArrow} <span title={rankTitle}>{rank}</span>
                </>
            </MainRowSpan>
            <MainRowSpan width="15%">{faction}</MainRowSpan>
            <MainRowSpan width="15%">{countryFlag}</MainRowSpan>
            <MainRowSpan width="50%">{alias}</MainRowSpan>
        </div>
    )
}

export default PlayerMainRow
