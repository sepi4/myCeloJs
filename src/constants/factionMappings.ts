import { FactionName } from '../types'

const FACTION_CODES: Record<string, FactionName> = {
    british: 'uk',
    aef: 'usa',
    soviet: 'sov',
    west_german: 'okw',
    german: 'wer',
}

export function getFactionCode(faction: string): string {
    return FACTION_CODES[faction] ?? ''
}

const FACTION_CODES_COH3: Record<string, string> = {
    americans: 'usa',
    afrika_korps: 'dak',
    british_africa: 'uk',
    germans: 'wer',
}

export function getFactionCodeCoh3(faction: string): string {
    return FACTION_CODES_COH3[faction] ?? ''
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

export function getFactionName(faction: string): string {
    return FACTION_NAMES[faction] ?? ''
}

const FACTION_BY_ID: Record<number, FactionName> = {
    0: 'wer',
    1: 'sov',
    2: 'okw',
    3: 'usa',
    4: 'uk',
}

export function getFactionCodeById(id: number): string {
    return FACTION_BY_ID[id] ?? ''
}
