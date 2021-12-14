import { Rank } from '../types'
import sorters from './sorters'

export function ranksArrFilter(
    ranksArr: Rank[],
    tableView: boolean,
    showAll: boolean
) {
    let reg = tableView ? /^Team/ : /^./
    let rankedOnly = !showAll
    ranksArr = ranksArr
        .filter((r) => r.name.match(reg))
        .filter((r) => (rankedOnly ? r.rank > 0 : true))
    return ranksArr
}

type Sorter = {
    name: 'byRank' | 'byWinRate' | 'byStreak' | 'byName' | 'byTotal'
    reversed: boolean
}

/**
 * Sorting array of Rank objects for rank list in drop menu
 * @param ranksArr unsorted array
 * @param sorter function for sorting
 * @returns sorted array
 */
export function ranksArrSort(ranksArr: Rank[], sorter: Sorter) {
    const byTotal = (a: Rank, b: Rank) => {
        let aTotal = a.wins + a.losses
        let bTotal = b.wins + b.losses
        return bTotal - aTotal
    }

    const f = sorters[sorter.name]

    if (sorter.name !== 'byRank') {
        return ranksArr.sort(f)
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
        const diff = f(a, b)
        if (diff !== 0) {
            return diff
        }
        return byTotal(a, b)
    })
    return [...pos, ...neg]
}
