import { useEffect } from 'react'

import { useNavigationStore } from '../stores/navigationStore'
import { useSettingsViewStore } from '../stores/settingsViewStore'

// Keyboard and mouse shortcuts for the back and forward buttons in the navbar.
// They listen on the whole window, so they work in every view, not only in the
// element that has focus.

// Only fields with a text cursor are listed. Checkboxes and radios keep focus
// after a click, and arrows should still move in the history then.
const TEXT_INPUT_TYPES = ['text', 'search', 'number', 'email', 'password', 'url', 'tel']

/** Arrow keys move the cursor in these, so they must not change the view. */
function isTextField(target: EventTarget | null) {
    if (target instanceof HTMLInputElement) {
        return TEXT_INPUT_TYPES.includes(target.type)
    }
    return (
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
    )
}

/** Left and right arrows and the mouse side buttons move back and forward in the history. */
export default function useNavigationKeys() {
    useEffect(() => {
        // The settings view covers the history, so it must not change behind it.
        const blocked = () => useSettingsViewStore.getState().settingsView

        const handleKeyDown = (e: KeyboardEvent) => {
            // Arrows with a modifier are left for other shortcuts, such as text selection.
            if (
                e.altKey ||
                e.ctrlKey ||
                e.metaKey ||
                e.shiftKey ||
                isTextField(e.target) ||
                blocked()
            ) {
                return
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                useNavigationStore.getState().goBack()
            } else if (e.key === 'ArrowRight') {
                e.preventDefault()
                useNavigationStore.getState().goForward()
            }
        }
        const handleMouseUp = (e: MouseEvent) => {
            if (blocked()) {
                return
            }
            // Buttons 3 and 4 are the back and forward side buttons of the mouse.
            if (e.button === 3) {
                e.preventDefault()
                useNavigationStore.getState().goBack()
            } else if (e.button === 4) {
                e.preventDefault()
                useNavigationStore.getState().goForward()
            }
        }
        // The handlers read the stores when they run, so they are added only once.
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('mouseup', handleMouseUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])
}
