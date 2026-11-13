import { Language } from '../types'
import text, { TextKey } from './translation'

function getText(key: TextKey, language?: Language): string {
    // The settings file is user-editable, so the saved language may be anything
    return text[key][language === 'ru' ? 'ru' : 'en']
}
export default getText
