import {
    useEffect,
    useState,
    useRef,
    KeyboardEvent,
    ChangeEvent,
} from 'react'
import { getExtraInfo } from '../../functions/getExtraInfo'
import getLastPlayedGame from '../../functions/getLastPlayedGame'
import getText from '../../functions/getText'
import { getTotalGames } from '../../functions/simpleFunctions'

import searchPlayers from '../../functions/searchPlayers'
import FoundPlayer from './FoundPlayer'

import styles from './Search.module.css'
import { Member } from '../../types'
import { useSettingsStore } from '../../stores/settingsStore'
import { useFoundPlayersStore } from '../../stores/foundPlayersStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { useViewStore } from '../../stores/viewStore'

export default function Search() {
    const { settings } = useSettingsStore()
    const inputRef = useRef<HTMLInputElement>(null)

    const [searchValue, setSearchValue] = useState('')
    const { foundPlayers, setFoundPlayers } = useFoundPlayersStore()
    const { navButtons: { coh3 } } = useNavButtonsStore()
    const { setPlayerCard } = usePlayerCardStore()
    const { setView } = useViewStore()

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && searchValue.trim().length > 0) {
            searchPlayers(
                coh3,
                searchValue, 
                (res) => {
                    const arrPlayers = res.map((p) => {
                        return {
                            country: p.country,
                            name: p.name,
                            profileId: p.profile_id,
                        }
                    })

                    if (arrPlayers.length === 0) {
                        setFoundPlayers([])
                        return
                    }

                    const ids: number[] = []
                    for (const p of arrPlayers) {
                        if (p.profileId) {
                            ids.push(p.profileId)
                        }
                    }
                    getExtraInfo(
                        coh3,
                        ids, 
                        (result) => {
                            const newPlayers = res
                                .map((p) => {
                                    if (result[p.profile_id]) {
                                        p.totalGames = getTotalGames(
                                            result[p.profile_id]?.ranks
                                        )
                                        p.lastGameTime = getLastPlayedGame(
                                            result[p.profile_id]
                                        )
                                    } else {
                                        p.totalGames = 0
                                    }
                                    p.extraInfo = result[p.profile_id]
                                    return p
                                })
                                .sort((a, b) => {
                                    if (
                                        typeof a.totalGames === 'number' &&
                                typeof b.totalGames === 'number'
                                    ) {
                                        return b.totalGames - a.totalGames
                                    }
                                    return 0
                                })

                            setFoundPlayers(newPlayers)
                        })
                })
        }
    }

    const handlePlayerCardOn = (player: Member) => {
        const playerData = {
            ...player,
            name: player.alias,
            profileId: player.profile_id + '',
            country: player.country,
        }
        const extraInfoData = {
            ranks: player.extraInfo?.ranks ?? [],
            steamId: player.name.substring(7),
        }
        setPlayerCard(playerData, extraInfoData)
        setView('playerCard')
    }

    const players =
        foundPlayers.length > 0 &&
        foundPlayers.map((p) => (
            <FoundPlayer
                key={p.profile_id}
                player={p}
                clickFun={() => {
                    handlePlayerCardOn(p)
                }}
            />
        ))

    useEffect(() => {
        inputRef.current?.focus()
    })

    return (
        <div className={styles.container}>
            <div className={styles.inputDiv}>
                <input
                    ref={inputRef}
                    className={styles.input}
                    placeholder={getText('steam_alias_or_id', settings)}
                    onChange={handleSearchInput}
                    onKeyUp={handleKeyUp}
                />
            </div>
            <div className={styles.content}>{players}</div>
        </div>
    )
}
