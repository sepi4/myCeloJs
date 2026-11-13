import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

import { fetchPlayerRanksByIds } from '../../functions/api/fetchPlayerRanks'
import searchPlayers from '../../functions/api/searchPlayers'
import { getTotalGames } from '../../functions/rankings/totalGames'
import getLastPlayedGame from '../../functions/utils/getLastPlayedGame'
import useText from '../../hooks/useText'
import { useFoundPlayersStore } from '../../stores/foundPlayersStore'
import { useGameStore } from '../../stores/gameStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { SearchResult } from '../../types'
import FoundPlayer from './FoundPlayer'

import styles from './Search.module.css'

export default function Search() {
    const getText = useText()
    const inputRef = useRef<HTMLInputElement>(null)

    const [searchValue, setSearchValue] = useState('')
    const { foundPlayers, setFoundPlayers } = useFoundPlayersStore()
    const { game } = useGameStore()
    const openPlayerCard = useNavigationStore((s) => s.openPlayerCard)

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    const handleKeyUp = async (e: KeyboardEvent) => {
        if (e.key === 'Enter' && searchValue.trim().length > 0) {
            const res = await searchPlayers(game, searchValue)
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
            const fetched = await fetchPlayerRanksByIds(game, ids)
            if (fetched) {
                const result = fetched.result
                const newPlayers = res
                    .map((p): SearchResult => {
                        const playerRanks = result[p.profile_id]
                        return {
                            ...p,
                            playerRanks,
                            totalGames: playerRanks ? getTotalGames(playerRanks.ranks) : 0,
                            lastGameTime: playerRanks && getLastPlayedGame(playerRanks),
                        }
                    })
                    .sort((a, b) => b.totalGames - a.totalGames)

                setFoundPlayers(newPlayers)
            }
        }
    }

    const handlePlayerCardOn = (player: SearchResult) => {
        const playerData = {
            ...player,
            name: player.alias,
            profileId: player.profile_id,
            country: player.country,
        }
        const playerRanksData = {
            ranks: player.playerRanks?.ranks ?? [],
            steamId: player.name.substring(7),
        }
        openPlayerCard(playerData, playerRanksData, game)
    }

    const players =
        foundPlayers &&
        foundPlayers.map((p) => (
            <FoundPlayer
                key={p.profile_id}
                player={p}
                onClick={() => {
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
                    data-testid="search-input"
                    ref={inputRef}
                    className={styles.input}
                    placeholder={getText('steam_alias_or_id')}
                    onChange={handleSearchInput}
                    onKeyUp={handleKeyUp}
                />
            </div>
            <div data-testid="search-results" className={styles.content}>
                {players}
                {foundPlayers?.length === 0 && (
                    <div data-testid="search-empty" className={styles.empty}>
                        {getText('no_players_found')}
                    </div>
                )}
            </div>
        </div>
    )
}
