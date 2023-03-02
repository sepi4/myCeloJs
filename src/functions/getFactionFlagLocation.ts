import flagOkw from '../../img/okw.png'
import flagSov from '../../img/sov.png'
import flagUk from '../../img/uk.png'
import flagUsa from '../../img/usa.png'
import flagWer from '../../img/wer.png'
import flagAfrikaKorps from '../../img/afrika_korps.png'
import flagAmericans from '../../img/americans.png'
import flagBrits from '../../img/british_africa.png'
import flagGermans from '../../img/germans.png'

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