import getText from '../functions/utils/getText'
import hasVisibleText from '../functions/utils/hasVisibleText'
import { useSettingsStore } from '../stores/settingsStore'

interface Props {
    name: string | null | undefined
}

// some players pick names that render as nothing, which would leave no text to click
export default function PlayerName({ name }: Props) {
    const { settings } = useSettingsStore()

    if (hasVisibleText(name)) {
        return <>{name}</>
    }
    return <i>{getText('no_name', settings)}</i>
}
