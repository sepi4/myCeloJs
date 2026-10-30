import { useEffect, useState } from 'react'

function useTimedBoolean(ms: number): [boolean, (x: boolean) => void] {
    const [status, setStatus] = useState(false)

    useEffect(() => {
        const timerId = setTimeout(() => setStatus(false), ms)
        return () => {
            clearTimeout(timerId)
        }
        // Setting the status again restarts the timer.
        // oxlint-disable-next-line react/exhaustive-effect-dependencies
    }, [status, ms])

    return [status, setStatus]
}

export default useTimedBoolean
