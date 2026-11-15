import { GAME_CONFIG, Game } from '../../constants/games'
import { SettingsType } from '../../types'
import { RankingsOptions } from './writeRankings'

// A missing format or orientation means the default, html and horizontal.
export function isOverlayHtml(settings: SettingsType): boolean {
    return settings.rankingsHtml !== false
}

export function isOverlayHorizontal(settings: SettingsType): boolean {
    return settings.rankingsHorizontal !== false
}

/** The overlay options from the settings, shared by the overlay and its preview. */
export function rankingsOptions(
    game: Game,
    settings: SettingsType,
    elo: boolean
): Required<Omit<RankingsOptions, 'avatars'>> {
    return {
        horizontal: isOverlayHorizontal(settings),
        showElo: GAME_CONFIG[game].hasElo && elo,
        showCountry: settings.rankingsShowCountry !== false,
        // The txt overlay has no images.
        showAvatar: settings.rankingsShowAvatar === true && isOverlayHtml(settings),
    }
}
