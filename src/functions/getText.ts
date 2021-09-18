import text from '../translation';

function getText(
    key: string,
    settings: { language: string }
): string | undefined {
    const lang: string = settings?.language ? settings.language : 'en';
    if (text[key]) {
        return text[key][lang];
    }
}
export default getText;
