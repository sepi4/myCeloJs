export function ranksArrFilter(ranksArr, tableView, showAll) {
    let reg = tableView ? /^Team/ : /^./
    // let rankedOnly = true // navSettings.ranked
    let rankedOnly = !showAll
    ranksArr = ranksArr
        .filter(r => r.name.match(reg))
        .filter(r => rankedOnly ? r.rank > 0 : true)
    return ranksArr
}

export function ranksArrSort(ranksArr, sorter) {
    const byTotal = (a, b) => {
        let aTotal = a.wins + a.losses
        let bTotal = b.wins + b.losses
        return bTotal - aTotal
    }

    if (sorter.name !== 'byRank') {
        return ranksArr.sort(sorter.fun)
    }

    let pos = []
    let neg = []
    for (const r of ranksArr) {
        if (r.rank < 0) {
            neg.push(r)
        } else {
            pos.push(r)
        }
    }
    neg = neg.sort(byTotal)

    pos = pos.sort((a, b) => {
        const diff = sorter.fun(a,b)
        if (diff !== 0) {
            return diff
        }
        return byTotal(a, b)
    })
    return [...pos, ...neg]
}