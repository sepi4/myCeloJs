// @ts-ignore
import flagOkw from '../../img/okw.png';
// @ts-ignore
import flagSov from '../../img/sov.png';
// @ts-ignore
import flagUk from '../../img/uk.png';
// @ts-ignore
import flagUsa from '../../img/usa.png';
// @ts-ignore
import flagWer from '../../img/wer.png';

import { FactionName } from '../types';

export function getFactionFlagLocation(code: FactionName) {
    switch (code) {
        case 'okw':
            return flagOkw;
        case 'sov':
            return flagSov;
        case 'uk':
            return flagUk;
        case 'usa':
            return flagUsa;
        case 'wer':
            return flagWer;
    }
}