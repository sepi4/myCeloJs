export type PlayerData = {
    slot: string
    name: string
    profileId: string | undefined
    teamSlot: string
    faction: string
}

/**
 * Splits a player data string into its fields.
 *
 * Expected format: `<slot> <name...> <profileId> <teamSlot> <faction>`
 */
export function splitPlayerData(data: string): PlayerData | undefined {
    const tokens = data.split(' ')
    const slot = tokens.shift()
    const faction = tokens.pop()
    const teamSlot = tokens.pop()
    const profileId = tokens.pop()
    const name = tokens.join(' ')

    if (!slot || !faction || !teamSlot) {
        return undefined
    }
    return { slot, name, profileId, teamSlot, faction }
}

/** AI players have the profile id -1 in the log. */
export function parseProfileId(profileId: string | undefined): number | undefined {
    const id = Number(profileId)
    return id > 0 ? id : undefined
}
