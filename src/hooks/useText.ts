import getText from '../translations/getText'
import { TextKey } from '../translations/translation'
import useLanguage from './useLanguage'

export default function useText() {
    const language = useLanguage()
    return (key: TextKey) => getText(key, language)
}
