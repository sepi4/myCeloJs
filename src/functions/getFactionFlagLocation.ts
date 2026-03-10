import flagOkw from '../assets/img/okw.png'
import flagSov from '../assets/img/sov.png'
import flagUk from '../assets/img/uk.png'
import flagUsa from '../assets/img/usa.png'
import flagWer from '../assets/img/wer.png'
import flagAfrikaKorps from '../assets/img/afrika_korps.png'
import flagAmericans from '../assets/img/americans.png'
import flagBrits from '../assets/img/british_africa.png'
import flagGermans from '../assets/img/germans.png'

import { FactionName } from '../types'

export function getFactionFlagLocation(code: FactionName) {
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

export function getFactionFlagLocationCoh3(code: string) {
    switch (code) {
        case 'afrika_korps':
            return flagAfrikaKorps
        case 'americans':
            return flagAmericans
        case 'british_africa':
            return flagBrits
        case 'germans':
            return flagGermans
    }
}
