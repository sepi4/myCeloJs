import { FactionName } from '../types'

const FACTION_CODES_COH2: Record<string, FactionName> = {
    british: 'uk',
    aef: 'usa',
    soviet: 'sov',
    west_german: 'okw',
    german: 'wer',
}

export function getFactionCodeCoh2(faction: string): string {
    return FACTION_CODES_COH2[faction] ?? ''
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

export function getFactionCodeCoh2ById(id: number): string {
    return FACTION_BY_ID[id] ?? ''
}

// race_id values from coh3-api.reliclink.com/community/leaderboard/GetAvailableLeaderboards?title=coh3
const FACTION_BY_ID_COH3: Record<number, string> = {
    129494: 'americans',
    137123: 'germans',
    197345: 'british_africa',
    198437: 'afrika_korps',
    203852: 'british_africa',
}

export function getFactionCodeCoh3ById(id: number): string {
    return FACTION_BY_ID_COH3[id] ?? ''
}
