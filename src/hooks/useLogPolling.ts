import { useEffect } from 'react'

import audioLocation from '../assets/audio/bell.mp3'
import { GAME_CONFIG } from '../constants/games'
import readAndCheckLog from '../functions/checkers/readAndCheckLog'
import { useAlertStore } from '../stores/alertStore'
import { useAutoLogCheckingStore } from '../stores/autoLogCheckingStore'
import { useGameStore } from '../stores/gameStore'
import { useLogCheckIntervalStore } from '../stores/logCheckIntervalStore'
import { useSettingsStore } from '../stores/settingsStore'

const playAudio = () => new Audio(audioLocation).play()

/** Returns a function that re-reads the log now, if auto checking is on. */
export default function useLogPolling() {
    const { alert } = useAlertStore()
    const { autoLogChecking } = useAutoLogCheckingStore()
    const { logCheckInterval } = useLogCheckIntervalStore()
    const { game } = useGameStore()
    const activeLogLocation = useSettingsStore(
        (state) => state.settings?.[GAME_CONFIG[game].logLocationKey]
    )

    // Poll the log on an interval
    useEffect(() => {
        if (!autoLogChecking || !activeLogLocation) {
            return
        }
        const intervalId = setInterval(
            () => readAndCheckLog(game, activeLogLocation, alert ? playAudio : undefined),
            logCheckInterval * 1000
        )

        return () => clearInterval(intervalId)
    }, [autoLogChecking, activeLogLocation, game, alert, logCheckInterval])

    // Re-read log when game toggle or log location changes
    useEffect(() => {
        if (activeLogLocation) {
            readAndCheckLog(game, activeLogLocation)
        }
    }, [game, activeLogLocation])

    return () => {
        if (autoLogChecking && activeLogLocation) {
            readAndCheckLog(game, activeLogLocation)
        }
    }
}
