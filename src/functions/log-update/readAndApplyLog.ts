import { Game } from '../../constants/games'
import { readLog } from '../log-parsing/readLog'
import applyLogIfChanged from './applyLogIfChanged'

export default async function readAndApplyLog(
    game: Game,
    logLocation: string,
    playAudio?: () => void
) {
    const data = await readLog(game, logLocation)
    applyLogIfChanged({ data, playAudio })
}
