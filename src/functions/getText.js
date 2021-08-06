import text from '../text'

function getText(key, lang = 'en') {
    return text[key][lang]
}
export default getText