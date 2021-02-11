export function refactronTableInfo(ranksArr) {
    let ranksObj = {
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
        let groups = r.name.match(/^(\d)v\d(.+)/)

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
    let solo = []
    let names = ['sov', 'wer', 'usa', 'okw', 'uk']
    for (let key of names) {
        for (let i = 1; i < 5; i++) {
            let o = ranksObj.solo[key][i]
            if (o) {
                solo.push(o)
            } else {
                solo.push(undefined)
            }
        }
    }
    return [solo, names]

}
