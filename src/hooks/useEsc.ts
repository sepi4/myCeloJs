import { useLayoutEffect, useRef } from 'react'

type EscapeCallback = () => void

/**
 * Layers that can be closed with Escape (modals, views, settings...).
 * The last layer in the list is the topmost one, so only it reacts to Escape.
 */
const escapeStack: EscapeCallback[] = []

function handleEscape(event: KeyboardEvent) {
    if (event.key !== 'Escape') {
        return
    }

    const closeTopmostLayer = escapeStack[escapeStack.length - 1]
    closeTopmostLayer?.()
}

/** Adds a layer to the stack and returns a function that removes it again. */
function subscribeToEscape(callback: EscapeCallback) {
    if (escapeStack.length === 0) {
        window.addEventListener('keydown', handleEscape)
    }
    escapeStack.push(callback)

    return () => {
        const index = escapeStack.indexOf(callback)
        if (index === -1) {
            return
        }

        escapeStack.splice(index, 1)
        if (escapeStack.length === 0) {
            window.removeEventListener('keydown', handleEscape)
        }
    }
}

/** Keeps the latest value in a ref so listeners can use it without re-subscribing. */
function useLatestRef<T>(value: T) {
    const ref = useRef(value)

    useLayoutEffect(() => {
        ref.current = value
    }, [value])

    return ref
}

/**
 * Calls `onEscape` when Escape is pressed, but only if this is the topmost
 * layer. Pass `enabled = false` to keep a closed modal out of the stack.
 */
export default function useEsc(onEscape: () => void, enabled = true) {
    const onEscapeRef = useLatestRef(onEscape)

    useLayoutEffect(() => {
        if (!enabled) {
            return
        }

        const listener = () => onEscapeRef.current()

        return subscribeToEscape(listener)
    }, [enabled, onEscapeRef])
}
