import hasVisibleText from '../functions/utils/hasVisibleText'
import useText from '../hooks/useText'

interface Props {
    name: string | null | undefined
}

// some players pick names that render as nothing, which would leave no text to click
export default function PlayerName({ name }: Props) {
    const getText = useText()

    if (hasVisibleText(name)) {
        return <>{name}</>
    }
    return <i>{getText('no_name')}</i>
}
