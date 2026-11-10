// \p{Default_Ignorable_Code_Point} covers zero-width marks and the Hangul fillers;
// the blank braille pattern is not in that set but renders empty too
const invisible = /[\s\p{Default_Ignorable_Code_Point}\p{Cc}\p{Cf}\u2800]/gu

function hasVisibleText(text: string | null | undefined): boolean {
    return (text ?? '').replace(invisible, '') !== ''
}

export default hasVisibleText
