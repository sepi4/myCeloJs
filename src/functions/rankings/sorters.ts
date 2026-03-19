interface Rank {
    rank: number
    wins: number
    losses: number
    streak: number
    name: string
}

const byRank = (a: Rank, b: Rank): number => a.rank - b.rank

const byWinRate = (a: Rank, b: Rank): number => {
    const aWinRate = a.wins / (a.wins + a.losses)
    const bWinRate = b.wins / (b.wins + b.losses)
    return bWinRate - aWinRate
}

const byStreak = (a: Rank, b: Rank): number => b.streak - a.streak

const byName = (a: Rank, b: Rank): number => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1
    }
    return 0
}

const byTotal = (a: Rank, b: Rank): number => {
    const aTotal = a.wins + a.losses
    const bTotal = b.wins + b.losses
    return bTotal - aTotal
}

export default { byRank, byWinRate, byStreak, byName, byTotal }
