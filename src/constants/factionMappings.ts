import { FactionName } from '../types'

const COMMON_NAMES: Record<string, FactionName> = {
    british: 'uk',
    aef: 'usa',
    soviet: 'sov',
    west_german: 'okw',
    german: 'wer',
}

export function commonName(str: string): FactionName {
    return COMMON_NAMES[str] ?? 'wer'
}

const COMMON_NAMES_COH3: Record<string, string> = {
    americans: 'usa',
    afrika_korps: 'dak',
    british_africa: 'uk',
    germans: 'wer',
}

export function commonNameCoh3(str: string): string {
    return COMMON_NAMES_COH3[str] ?? 'wer'
}

const FACTION_NAMES: Record<string, string> = {
    // coh2
    soviet: 'Soviet',
    german: 'German',
    aef: 'AEF',
    british: 'British',
    west_german: 'WestGerman',
    // coh3
    british_africa: 'British',
    americans: 'American',
    afrika_korps: 'DAK',
    germans: 'German',
}

export function getFactionName(x: string): string {
    return FACTION_NAMES[x] ?? ''
}

const FACTION_BY_ID: Record<number, FactionName> = {
    0: 'wer',
    1: 'sov',
    2: 'okw',
    3: 'usa',
    4: 'uk',
}

export function getFactionById(id: number): FactionName {
    return FACTION_BY_ID[id] ?? 'wer'
}
