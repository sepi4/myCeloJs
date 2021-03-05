export function commonName(str) {
    switch (str) {
        case 'british':
            return 'uk'
        case 'aef':
            return 'usa'
        case 'soviet':
            return 'sov'
        case 'west_german':
            return 'okw'
        case 'german':
            return 'wer'
        default:
            return '?????'
    }
}

export function formatToStr(arr) {
    for (let obj of arr) {
        for (let key of Object.keys(obj)) {
            if (typeof (obj[key]) === 'number') {
                obj[key] = obj[key].toString()
            }
        }
    }
    return arr
}

export function separateTeams(arr) {
    let teams = [[], []]
    for (let obj of arr) {
        if (obj.teamSlot === 0) {
            teams[0].push(obj)
        } else {
            teams[1].push(obj)
        }
    }
    return teams
}

export function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export function formatToNums(arr) {
    for (let obj of arr) {
        for (let key of Object.keys(obj)) {
            if (!isNaN(obj[key])) {
                obj[key] = +obj[key]
            }
        }
    }
    return arr
}

export function getFactionName(x) {
    switch (x) {
        case 'soviet':
            return 'Soviet'
        case 'german':
            return 'German'
        case 'aef':
            return 'AEF'
        case 'british':
            return 'British'
        case 'west_german':
            return 'WestGerman'
        default:
            return undefined
    }
}

export function getFactionById(id) {
    switch (id) {
        case 0:
            return 'wer'
        case 1:
            return 'sov'
        case 2:
            return 'okw'
        case 3:
            return 'usa'
        case 4:
            return 'uk'
        default:
            return undefined
    }
}