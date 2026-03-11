import { RELIC_SERVER_BASE_COH2, RELIC_SERVER_BASE_COH3 } from '../constants'
import { Member, StatGroup } from '../types'

export default async function searchPlayers(coh3: boolean, searchValue: string): Promise<Member[]> {
    const url = `${coh3 ? RELIC_SERVER_BASE_COH3 : RELIC_SERVER_BASE_COH2}/GetPersonalStat?title=coh2&search=${searchValue}`

    try {
        const res = await fetch(url)
        const data = await res.json()
        if (data.result.message === 'SUCCESS') {
            return data.statGroups
                .filter((p: StatGroup) => p.type === 1)
                .map((p: StatGroup) => p.members[0])
        }
        console.log('searchPlayers else:', data)
        return []
    } catch (error) {
        console.error(error)
        return []
    }
}
