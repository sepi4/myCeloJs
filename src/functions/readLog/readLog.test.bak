import { getCurrentUserAlias, getLines } from './readLog'

describe('getCurrentUser: ', () => {
    test('getCurrentUser return correct username', () => {
        let txt = `
03:49:54.61   Not able to open the offline items file
03:49:54.62   GAME -- Current user name is [sepi]
03:49:54.75   GAME -- Company Of Heroes 2, Build [4.0.0.23887], Language [english]
`
        let lines = txt.split('\n')
        let result = getCurrentUserAlias(lines)
        // expect(result).toMatch(/^sepi$/)
        expect(result).toBe('sepi')
    })

    test('getCurrentUser complicated username', () => {
        let txt = `
03:49:54.61   Not able to open the offline items file
03:49:54.62   GAME -- Current user name is [[sepi kissa ]]
03:49:54.75   GAME -- Company Of Heroes 2, Build [4.0.0.23887], Language [english]
`
        let lines = txt.split('\n')
        let result = getCurrentUserAlias(lines)
        // expect(result).toMatch(/^\[sepi kissa \]$/)
        expect(result).toBe('[sepi kissa ]')
    })
})

describe('getLines:', () => {
    test('getLines should get correct txt lines', () => {
        let txt = `
03:50:51.90   GAME -- Win Condition Name: cheatcommands_mod_v2_annihilation
03:50:51.90   GAME -- Mod Pack: 2 5ed2ead7bbf94c01833685dfa1f23ac1 469832e4d0f6fcdee264be981cfecda0
03:50:51.90   GAME -- Human Player: 0 sepi 580525 0 west_german
03:50:51.90   GAME -- AI Player: 1 CPU - Easy -1 1 aef
03:50:57.79   GameObj::StartGameObj - info, network session GUID set to [728205478].
03:50:58.55   OBJECTSCAR -- Initialization failed - could not load scar type BP list.
`
        let lines = txt.split('\n')
        let result = getLines(lines)
        expect(result).toEqual([
            '03:50:51.90   GAME -- AI Player: 1 CPU - Easy -1 1 aef',
            '03:50:51.90   GAME -- Human Player: 0 sepi 580525 0 west_german',
        ])
    })
})
