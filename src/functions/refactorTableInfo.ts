import { Rank } from '../types'

type ModeObj = {
    [key: number]: Rank
}
type RanksObj = {
    solo: {
        [key: string]: ModeObj
    }
    team: []
}
type Result = [(Rank | undefined)[], string[]]

export function refactronTableInfo(ranksArr: Rank[]): Result {
    const ranksObj: RanksObj = {
        solo: {
            sov: {},
            usa: {},
            uk: {},
            wer: {},
            okw: {},
        },
        team: [],
    }

    for (const r of ranksArr) {
        const groups = r.name.match(/^(\d)v\d(.+)/)

        if (groups) {
            if (groups[2] === 'Soviet') {
                ranksObj.solo.sov[+groups[1]] = r
            } else if (groups[2] === 'AEF') {
                ranksObj.solo.usa[+groups[1]] = r
            } else if (groups[2] === 'British') {
                ranksObj.solo.uk[+groups[1]] = r
            } else if (groups[2] === 'German') {
                ranksObj.solo.wer[+groups[1]] = r
            } else if (groups[2] === 'WestGerman') {
                ranksObj.solo.okw[+groups[1]] = r
            }
        }
    }

    const solo: (Rank | undefined)[] = []
    const names = ['sov', 'wer', 'usa', 'okw', 'uk']

    names.forEach((key: string) => {
        for (let i = 1; i < 5; i++) {
            const o: Rank = ranksObj.solo[key][i]
            if (o) {
                solo.push(o)
            } else {
                solo.push(undefined)
            }
        }
    })

    return [solo, names]
}

export function refactronTableInfoCoh3(ranksArr: Rank[]): Result {
    const ranksObj: RanksObj = {
        solo: {
            afrika_korps: {},
            americans: {},
            british_africa: {},
            germans: {},
        },
        team: [],
    }

    for (const r of ranksArr) {
        const groups = r.name.match(/^(\d)v\d(.+)/)

        if (groups) {
            if (groups[2] === 'DAK') {
                ranksObj.solo.afrika_korps[+groups[1]] = r
            } else if (groups[2] === 'American') {
                ranksObj.solo.americans[+groups[1]] = r
            } else if (groups[2] === 'British') {
                ranksObj.solo.british_africa[+groups[1]] = r
            } else if (groups[2] === 'German') {
                ranksObj.solo.germans[+groups[1]] = r
            }
        }
    }

    const solo: (Rank | undefined)[] = []
    const names = ['afrika_korps', 'germans', 'americans', 'british_africa']

    names.forEach((key: string) => {
        for (let i = 1; i < 5; i++) {
            const o: Rank = ranksObj.solo[key][i]
            if (o) {
                solo.push(o)
            } else {
                solo.push(undefined)
            }
        }
    })

    return [solo, names]
}