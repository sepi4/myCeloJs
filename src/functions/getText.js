import text from '../text'

function getText(key, settings) {
    const lang = settings && settings.language ? settings.language : 'en'
    return text[key][lang]
}
export default getText