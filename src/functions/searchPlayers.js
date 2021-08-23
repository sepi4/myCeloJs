import axios from 'axios'

export default function searchPlayers(searchValue, callback) {
    const url = "https://coh2-api.reliclink.com"
        + '/community/leaderboard/GetPersonalStat?title=coh2&search='
        + searchValue

    axios.get(url)
        .then(result => {
            if (
                result.status === 200
                && result.data.result.message === 'SUCCESS'
            ) {
                let playerArr = result.data.statGroups.filter(x => x.type === 1)
                playerArr = playerArr.map(x => x.members[0])
                callback(playerArr)
            } else {
                console.log('searchPlayers else:', result)
                callback([])
            }
        })
        .catch(error => {
            console.error(error)
            callback([])
        })

}