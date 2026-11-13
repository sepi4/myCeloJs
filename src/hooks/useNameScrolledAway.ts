import { useEffect, useRef, useState } from 'react'

/** Tells when the element in nameRef has scrolled under the element in stickyRef. */
export default function useNameScrolledAway() {
    const nameRef = useRef<HTMLDivElement>(null)
    const stickyRef = useRef<HTMLDivElement>(null)
    const [nameScrolledAway, setNameScrolledAway] = useState(false)

    useEffect(() => {
        function check() {
            const nameEl = nameRef.current
            const stickyEl = stickyRef.current
            if (!nameEl || !stickyEl) {
                return
            }
            // The sticky anchor stops right under the navbar, so its top tells where the navbar ends.
            const covered =
                nameEl.getBoundingClientRect().bottom <= stickyEl.getBoundingClientRect().top
            setNameScrolledAway(covered)
        }
        check()
        window.addEventListener('scroll', check, { passive: true })
        window.addEventListener('resize', check)
        return () => {
            window.removeEventListener('scroll', check)
            window.removeEventListener('resize', check)
        }
    }, [])

    return { nameRef, stickyRef, nameScrolledAway }
}
