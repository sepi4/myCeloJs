function getSiteLink(site) {
    switch (site) {
        case 'coh2.org':
            return 'https://www.coh2.org/'
                + 'ladders/playercard/steamid/'

        default:
            return 'https://coh2stats.com/'
                + 'players/'

    }
}

export default getSiteLink