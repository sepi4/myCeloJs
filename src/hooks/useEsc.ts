import { useEffect } from 'react'

interface E {
    key: string
}

export default function useEsc(fun: () => void) {
    // esc button close player card

    function escPressed(e: E) {
        if (e.key === 'Escape') {
            fun()
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', escPressed)
        return () => {
            window.removeEventListener('keydown', escPressed)
        }
    })
}
