import { anyKeyOpen, toggleKey, toggleKeys } from './openKeys'

describe('toggleKey', () => {
    test('opens a closed key', () => {
        expect(toggleKey([1], 2)).toEqual([1, 2])
    })

    test('closes an open key', () => {
        expect(toggleKey([1, 2], 1)).toEqual([2])
    })
})

describe('anyKeyOpen', () => {
    test('is true when one of the keys is open', () => {
        expect(anyKeyOpen([3], [1, 3])).toBe(true)
    })

    test('ignores open keys outside the group', () => {
        expect(anyKeyOpen([5], [1, 3])).toBe(false)
    })

    test('is false for an empty group', () => {
        expect(anyKeyOpen([1], [])).toBe(false)
    })
})

describe('toggleKeys', () => {
    test('opens all keys when none is open', () => {
        expect(toggleKeys([9], [1, 2])).toEqual([9, 1, 2])
    })

    test('closes all keys when some are open and keeps other keys', () => {
        expect(toggleKeys([1, 9], [1, 2])).toEqual([9])
    })

    test('group is closed again after its only key is closed separately', () => {
        let open = toggleKeys<number>([], [1])
        open = toggleKey(open, 1)
        expect(anyKeyOpen(open, [1])).toBe(false)
        expect(toggleKeys(open, [1])).toEqual([1])
    })
})
