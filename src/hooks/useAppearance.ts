import { useEffect } from 'react'

import { useSettingsStore } from '../stores/settingsStore'

const FONT_SIZE = { small: '100%', medium: '125%', large: '150%' } as const
const INPUT_SCALE = { small: '1', medium: '1.25', large: '1.5' } as const

/** Applies the font size and theme settings to the document root. */
export default function useAppearance() {
    const fontSize = useSettingsStore((state) => state.settings?.fontSize) ?? 'small'
    const theme = useSettingsStore((state) => state.settings?.theme) ?? 'dark'

    useEffect(() => {
        document.documentElement.style.fontSize = FONT_SIZE[fontSize]
        document.documentElement.style.setProperty('--input-scale', INPUT_SCALE[fontSize])
    }, [fontSize])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])
}
