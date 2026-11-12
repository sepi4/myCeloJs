import { Game } from '../../constants/games'
import { readLog } from '../log-parsing/readLog'
import checkLogData from './checkLogData'

export default async function readAndCheckLog(
    game: Game,
    logLocation: string,
    playAudio?: () => void
) {
    const data = await readLog(game, logLocation)
    checkLogData({ data, playAudio })
}
