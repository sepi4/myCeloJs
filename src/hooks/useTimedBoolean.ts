import { useEffect, useState } from 'react'

function useTimedBoolean(ms: number) {
    const [status, setStatus] = useState(false)

    useEffect(() => {
        const timerId = setTimeout(() => setStatus(false), ms)
        return () => {
            clearTimeout(timerId)
        }
    }, [status])

    return [status, setStatus]
}

export default useTimedBoolean
