// images
import flagOkw from '../img/okw.png'
import flagSov from '../img/sov.png'
import flagUk from '../img/uk.png'
import flagUsa from '../img/usa.png'
import flagWer from '../img/wer.png'

export function getFactionFlagLocation(code) {
    switch (code) {
        case 'okw':
            return flagOkw
        case 'sov':
            return flagSov
        case 'uk':
            return flagUk
        case 'usa':
            return flagUsa
        case 'wer':
            return flagWer
    }
}