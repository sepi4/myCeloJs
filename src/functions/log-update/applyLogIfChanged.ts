import { useLastLogPlayersStore } from '../../stores/lastLogPlayersStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { Player } from '../../types'
import applyLogPlayers from './applyLogPlayers'

interface Props {
    data: Player[]
    playAudio?: () => void
}

export default function applyLogIfChanged({ data, playAudio }: Props) {
    const { lastLogPlayers } = useLastLogPlayersStore.getState()
    if (JSON.stringify(lastLogPlayers) === JSON.stringify(data)) {
        return
    }
    applyLogPlayers(data)
    if (useSettingsStore.getState().settings && playAudio && data.length > 0) {
        playAudio()
    }
}
