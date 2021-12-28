import { getPlayersInfo } from './getPlayersInfo'

describe('getPlayersInfo:', () => {

    let beforeArr
    let resultObj

    beforeEach(() => {
        beforeArr = [
            "02:39:32.96   GAME -- Human Player: 3 ModryPotapac 2696505 1 german",
            "02:39:32.96   GAME -- Human Player: 2 -syN- 122475 0 british",
            "02:39:32.96   GAME -- Human Player: 1 vangdeo 1886249 1 west_german",
            "02:39:32.96   GAME -- Human Player: 0 Crateruss 509400 0 soviet"
        ]

        resultObj = [
            {
                faction: "soviet",
                name: "Crateruss",
                profileId: "509400",
                ranking: "-1",
                slot: "0",
                teamSlot: "0",
                time: "02:39:32.96",
            },
            {
                faction: "west_german",
                name: "vangdeo",
                profileId: "1886249",
                ranking: "-1",
                slot: "1",
                teamSlot: "1",
                time: "02:39:32.96",
            },
            {
                faction: "british",
                name: "-syN-",
                profileId: "122475",
                ranking: "-1",
                slot: "2",
                teamSlot: "0",
                time: "02:39:32.96",
            },
            {
                faction: "german",
                name: "ModryPotapac",
                profileId: "2696505",
                ranking: "-1",
                slot: "3",
                teamSlot: "1",
                time: "02:39:32.96",
            },
        ]
    })

    test('getPlayersInfo returs correct object', () => {
        expect(getPlayersInfo(beforeArr)).toEqual(resultObj)
    })

})