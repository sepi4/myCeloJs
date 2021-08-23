function getSiteLink(site) {
    switch (site) {
        case 'coh2.org':
            return 'https://www.coh2.org/'
                + 'ladders/playercard/steamid/'

        case 'steam':
            return 'https://steamcommunity.com/profiles/'

        default:
            return 'https://coh2stats.com/'
                + 'players/'

    }
}

export default getSiteLink