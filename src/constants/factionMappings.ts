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
