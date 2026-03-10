import { COH2_ORG, COH2STATS_COM, COH3STATS_COM, STEAM } from '../constants'

function getSiteLink(site: string) {
    switch (site) {
        case 'coh2.org':
            return COH2_ORG

        case 'coh3stats.com':
            return COH3STATS_COM

        case 'steam':
            return STEAM

        default:
            return COH2STATS_COM
    }
}

export default getSiteLink
