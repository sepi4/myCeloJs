import { GAME_CONFIG } from '../../constants/games'
import { useDisplayGame } from '../../hooks/useDisplayGame'
import { useDisplayOptionsStore } from '../../stores/displayOptionsStore'
import { Rank } from '../../types'
import FactionIcon from './FactionIcon'
import TableRankRow from './TableRankRow'

interface Props {
    ranks: (Rank | undefined)[]
    startIndex: number
    faction: string
}

function FactionRanks({ ranks, startIndex, faction }: Props) {
    const {
        displayOptions: { showElo: elo },
    } = useDisplayOptionsStore()
    const showElo = GAME_CONFIG[useDisplayGame()].hasElo && elo
    const rows = [0, 1, 2, 3].map((offset) => {
        const teamSize = offset + 1
        const rankData = ranks[startIndex + offset]
        let winPercent = '-'
        let totalGames = 0
        let totalTitle: string | undefined
        let rank: number | string = '-'
        let streak: number | string = '-'
        const rankTotal = rankData?.ranktotal ?? 0
        if (rankData) {
            const winRate = (rankData.wins / (rankData.wins + rankData.losses)) * 100
            winPercent = winRate.toFixed(0) + '%'
            totalGames = rankData.wins + rankData.losses
            totalTitle = `${rankData.wins} / ${rankData.losses}`
            if (rankData.rank > 0) {
                rank = rankData.rank
            }
            streak = rankData.streak
        }
        const rating = showElo ? (rankData?.rating ?? '-') : undefined
        return (
            <TableRankRow
                key={offset + 'rank'}
                {...{
                    rank,
                    teamSize,
                    winPercent,
                    streak,
                    totalGames,
                    totalTitle,
                    rankTotal,
                    rating,
                }}
            />
        )
    })

    return (
        <>
            <FactionIcon faction={faction} size="2.2em" />
            <div style={{ gridColumn: '2 / 7' }}>{rows}</div>
        </>
    )
}

export default FactionRanks
