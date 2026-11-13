import { useEffect } from 'react'

import audioLocation from '../assets/audio/bell.mp3'
import readAndApplyLog from '../functions/log-update/readAndApplyLog'
import { useAlertStore } from '../stores/alertStore'
import { useAutoLogCheckingStore } from '../stores/autoLogCheckingStore'
import { useGameStore } from '../stores/gameStore'
import { useLogCheckIntervalStore } from '../stores/logCheckIntervalStore'
import useActiveLogLocation from './useActiveLogLocation'

const playAudio = () => new Audio(audioLocation).play()

/** Returns a function that re-reads the log now, if auto checking is on. */
export default function useLogPolling() {
    const { alert } = useAlertStore()
    const { autoLogChecking } = useAutoLogCheckingStore()
    const { logCheckInterval } = useLogCheckIntervalStore()
    const { game } = useGameStore()
    const activeLogLocation = useActiveLogLocation()

    // Poll the log on an interval
    useEffect(() => {
        if (!autoLogChecking || !activeLogLocation) {
            return
        }
        const intervalId = setInterval(
            () => readAndApplyLog(game, activeLogLocation, alert ? playAudio : undefined),
            logCheckInterval * 1000
        )

        return () => clearInterval(intervalId)
    }, [autoLogChecking, activeLogLocation, game, alert, logCheckInterval])

    // Re-read log when game toggle or log location changes
    useEffect(() => {
        if (activeLogLocation) {
            readAndApplyLog(game, activeLogLocation)
        }
    }, [game, activeLogLocation])

    return () => {
        if (autoLogChecking && activeLogLocation) {
            readAndApplyLog(game, activeLogLocation)
        }
    }
}
