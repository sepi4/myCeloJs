import { GAME_CONFIG, Game } from '../../constants/games'
import { SettingsType } from '../../types'
import { RankingsOptions } from './writeRankings'

/** The overlay options from the settings, shared by the overlay and its preview. */
export function rankingsOptions(
    game: Game,
    settings: SettingsType,
    elo: boolean
): Required<Omit<RankingsOptions, 'avatars'>> {
    return {
        horizontal: settings.rankingsHorizontal === true,
        showElo: GAME_CONFIG[game].hasElo && elo,
        showCountry: settings.rankingsShowCountry !== false,
        // The txt overlay has no images.
        showAvatar: settings.rankingsShowAvatar === true && settings.rankingsHtml !== false,
    }
}
