import { useEffect } from 'react'


export default function useEsc(fun) {

    // esc button close player card
    function escPressed(e) {
        if (e.key === 'Escape') {
            fun()
        }
    }
    useEffect(() => {
        window.addEventListener('keydown', escPressed);
        return () => {
            window.removeEventListener('keydown', escPressed);
        }
    })

}
