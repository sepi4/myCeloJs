import { useFromFileStore } from '../../stores/fromFileStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { Player } from '../../types'
import setPlayersWithoutChecking from './setPlayersWithoutChecking'

interface Props {
    data: Player[]
    playAudio?: () => void
}

export default function checkLogData({ data, playAudio }: Props) {
    const { fromFile } = useFromFileStore.getState()
    if (JSON.stringify(fromFile) === JSON.stringify(data)) {
        return
    }
    setPlayersWithoutChecking(data)
    if (useSettingsStore.getState().settings && playAudio && data.length > 0) {
        playAudio()
    }
}
