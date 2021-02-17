const byRank = (a, b) => a.rank - b.rank

const byWinRate = (a, b) => {
    const aWinRate = a.wins / (a.wins + a.losses)
    const bWinRate = b.wins / (b.wins + b.losses)
    return bWinRate - aWinRate
}

const byStreak = (a, b) => b.streak - a.streak

const byName = (a, b) => {
    if ((a.name).toLowerCase() < (b.name).toLowerCase()) {
        return -1;
    }
    if ((a.name).toLowerCase() > (b.name).toLowerCase()) {
        return 1;
    }
    return 0;
}

const byTotal = (a, b) => {
    const aTotal = a.wins + a.losses
    const bTotal = b.wins + b.losses
    return bTotal - aTotal
}

export {
    byRank,
    byWinRate,
    byStreak,
    byName,
    byTotal,
}