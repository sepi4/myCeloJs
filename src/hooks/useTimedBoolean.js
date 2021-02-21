import { useEffect, useState } from 'react'

function useTimedBoolean(time) {
    const [status, setStatus] = useState(false)

    useEffect(() => {
        const timerId = setTimeout(() => setStatus(false), time)
        return () => {
            clearTimeout(timerId)
        }
    }, [status])

    return [
        status,
        setStatus,
    ]
}

export default useTimedBoolean