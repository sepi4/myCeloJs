import { STEAM, COH2STATS_COM, COH2_ORG } from '../constants';

function getSiteLink(site: string) {
    switch (site) {
        case 'coh2.org':
            return COH2_ORG;

        case 'steam':
            return STEAM;

        default:
            return COH2STATS_COM;
    }
}

export default getSiteLink;
