import text from '../translation'

type X = { language: string } | null;

function getText(key: string, settings: X): string | undefined {
    const lang = settings?.language === 'ru' ? settings.language : 'en'

    if (text[key]) {
        return text[key][lang]
    }
}
export default getText
