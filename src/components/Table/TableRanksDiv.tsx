import { useDisplayCoh3 } from '../../hooks/useDisplayCoh3'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { Rank } from '../../types'
import FactionIcon from './FactionIcon'
import TableRankRow from './TableRankRow'

interface Props {
    ranks: (Rank | undefined)[]
    startIndex: number
    faction: string
}

function TableRanksDiv({ ranks, startIndex, faction }: Props) {
    const {
        navButtons: { elo },
    } = useNavButtonsStore()
    const coh3 = useDisplayCoh3()
    const rows = [0, 1, 2, 3].map((offset) => {
        const teamSize = offset + 1
        const rankData = ranks[startIndex + offset]
        let winPercent = '-'
        let totalGames = 0
        let rank: number | string = '-'
        let streak: number | string = '-'
        const rankTotal = rankData?.ranktotal ?? '?'
        if (rankData) {
            const winRate = (rankData.wins / (rankData.wins + rankData.losses)) * 100
            winPercent = winRate.toFixed(0) + '%'
            totalGames = rankData.wins + rankData.losses
            if (rankData.rank > 0) {
                rank = rankData.rank
            }
            streak = rankData.streak
        }
        const rating = coh3 && elo ? (rankData?.rating ?? '-') : undefined
        return (
            <TableRankRow
                key={offset + 'rank'}
                {...{
                    rank,
                    teamSize,
                    winPercent,
                    streak,
                    totalGames,
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

export default TableRanksDiv
