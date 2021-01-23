import { React, ReactDOM } from './importReact'

let appVersion = require('electron').remote.app.getVersion();
document.title = 'sepi-celo LADDER BUG VERSION' + appVersion

const { useEffect, useState } = React
const { dialog, clipboard } = require('electron').remote

const { shell } = require('electron')
const axios = require('axios')
const fs = require('fs')

let updateCheckNotDone = true
let isReplay = true

function getLines(data) {
    let lines = data.split('\n')
    let arr = []
    let stop = false
    let wasGame = false
    let wasNone = false
    isReplay = true

    for (let i = lines.length - 1; i >= 0; i--) {
        const row = lines[i]
        if (row.match('GAME --.* Player:')) {
            wasGame = true
            if (wasGame && wasNone) {
                break
            }
            arr.push(row)
        } else if (row.match('Match Started.*steam.*slot.*ranking')) {
            isReplay = false
            stop = true
            arr.push(row)
        } else if (stop) {
            break
        } else if (wasGame) {
            wasNone = true
        }
    }
    return arr
}

function getPlayersInfo(arr) {
    arr = arr.map(row => {
        if (row.match(/GAME --.* Player:/)) {
            let splited = row.split(':')
            return splited.slice(3).join(':').trim()
        } else {
            let splited = row.split(':')
            return splited[splited.length - 1].trim()
        }
    })

    let steamIds = {}
    let players = {}
    for (let row of arr) {
        let id = row.match(/^.*\/steam\/(\d+).+/)
        let slot = row.match(/, slot = +(\d), ranking/)
        let ranking = row.match(/, ranking = +(-?\d+)/)
        if (id && slot && ranking) {
            id = id[1]
            slot = slot[1]
            ranking = ranking[1]
            steamIds[slot] = {
                id,
                slot,
                ranking,
            }
        } else {
            let playerArr = row.split(' ')
            slot = playerArr.shift()
            let faction = playerArr.pop()
            let teamSlot = playerArr.pop()
            let profileId = playerArr.pop()
            let name = playerArr.join(' ')
            players[slot] = {
                teamSlot,
                profileId,
                name,
                slot,
                faction,
            }
        }
    }

    //combine into one obj
    return Object.keys(players).map(key => {
        // if (steamIds.hasOwnProperty(key)) {
        if (steamIds[key]) {
            let p = players[key]
            p.ranking = steamIds[key].ranking
            p.id = steamIds[key].id
            return p
        } else {
            let p = players[key]
            p.ranking = '-1'
            return p
        }
    })
}

function getExtraInfo(players, callback) {

    let ids = players.filter(p => p.profileId != undefined)
        .map(p => p.profileId)

    const url = 'https://coh2-api.reliclink.com/community/'
        + 'leaderboard/GetPersonalStat?title=coh2&profile_ids=['
        + ids.join(',') + ']'

    let leaderboard = undefined
    let cohTitles = undefined

    const fetch1 = axios.get(url)

    const url2 =
        'https://coh2-api.reliclink.com/' +
        'community/leaderboard/GetAvailableLeaderboards?title=coh2'

    const fetch2 = axios.get(url2)

    Promise.all([fetch1, fetch2])
        .then(values => {

            // console.log('logic, PROMISE ALL, then')
            if (values[0].status === 200 && values[1].status === 200) {
                leaderboard = values[0].data
                cohTitles = values[1].data
                let result = refactorData(leaderboard, cohTitles, ids)
                const teams = guessRankings(players, leaderboard, cohTitles)

                callback(result, isReplay, teams)
            }
        })
        .catch(error => {
            console.log(error)
        })
}

function refactorData(leaderboard, cohTitles, ids) {
    // leaderboard:
    //         -leaderboardStats: []
    //                  - statGroup_id
    //                  - leaderboard_id
    //                  - rank
    //                  ...
    //          -statGroups: []
    //                      - id
    //                      - members: []
    //                              - name (steam id)
    //                              - alias
    //                              - personal_statgroup_id

    // cohTitles:
    //         -leaderboards: []
    //             - id
    //             - name

    let players = {}
    for (const id of ids) {
        players[id] = {
            ranks: [],
        }
    }

    let statGroups = {}
    for (const x of leaderboard.statGroups) {
        statGroups[x.id] = x
    }

    let names = {}
    // for (const x of cohTitles.leaderboards) {
    // get all that are ranked
    for (const x of cohTitles.leaderboards.filter(l => l.isranked === 1)) {
        names[x.id] = x.name
    }

    // for (const x of leaderboard.leaderboardStats.filter(l => l.rank > -1)) {
    for (const x of leaderboard.leaderboardStats) {
        // check members

        let group = statGroups[x.statgroup_id]


        for (const member of group.members) {
            let id = member.profile_id
            if (
                players[id]
                && !players[id].ranks.find(y =>
                    y.statgroup_id === x.statgroup_id &&
                    y.leaderboard_id === x.leaderboard_id
                )
                && names[x.leaderboard_id]
            ) {
                players[id].ranks.push({
                    members: group.members,
                    name: names[x.leaderboard_id],
                    ...x,
                    // statGroup_id: x.statGroup_id,
                    // rank: x.rank,
                    // leaderboard_id: x.leaderboard_id,
                })
                break
            }
        }

        // console.log('BUG: after')
    }

    return players
}

function obsFaction(str) {
    return commonName(str)
}

function commonName(str) {
    switch (str) {
        case 'british':
            return 'uk'
        case 'aef':
            return 'usa'
        case 'soviet':
            return 'sov'
        case 'west_german':
            return 'okw'
        case 'german':
            return 'wer'
        default:
            return '?????'
    }
}

function formatToStr(arr) {
    for (let obj of arr) {
        for (let key of Object.keys(obj)) {
            if (typeof(obj[key]) === 'number') {
                obj[key] = obj[key].toString()
            }
        }
    }
    return arr
}

function writeRankings(players, fileLocation, from) {
    console.log('writeRankings from:', from)
    players = formatToStr(players)
    let str1 = ''
    let str2 = ''
    for (let i = 0; i < players.length; i++) {
        const name = players[i].name
        let ranking = players[i].ranking === '-1' ? '-' : players[i].ranking
        if (!isNaN(ranking)) {
            ranking = (+ranking + 1).toString()
        }
        const faction = players[i].faction
        const slot = Number(players[i].slot)

        const text = ranking.padEnd(5)
            + " " + obsFaction(faction).padEnd(5)
            + " " + name + " \n"

        if (slot % 2 === 0) {
            str1 += text
        } else {
            str2 += text
        }
    }

    // console.log('writeRankings: ', fileLocation)
    fs.writeFile(
        fileLocation,
        str1 + '\n' + str2,
        'utf-8',
        (err) => {
            if (err) {
                console.log('Error in writing rankings.txt file: ', err)
            }
        },
    )
}

function readLog(fileLocation, callback) {
    console.log('readLog')
    // console.log('readLog, fileLocation:', fileLocation)
    fileLocation = fileLocation.replace(/\\/, '\\\\')
    fs.readFile(fileLocation, 'utf-8', (err, data) => {
        if (err) {
            console.log('Error in reading logfile: ', err)
        }
        let arr = getLines(data)
        callback(getPlayersInfo(arr))
    })
}

// ======= guess.js =======

function separateTeams(arr) {
    let teams = [[], []]
    for (let obj of arr) {
        if (obj.teamSlot === 0) {
            teams[0].push(obj)
        } else {
            teams[1].push(obj)
        }
    }
    return teams
}

function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function formatToNums(arr) {
    for (let obj of arr) {
        for (let key of Object.keys(obj)) {
            if (!isNaN(obj[key])) {
                obj[key] = +obj[key]
            }
        }
    }
    return arr
}

function findTeamStatGroup(team, data) {
    // filter type
    let statGroups = data.statGroups
        .filter(s => s.type == team.length)
        .filter(s => s.members
            .every(el => team.find(m => m.profileId === el.profile_id)
        )
    )

    if (statGroups.length === 1) {
        return statGroups[0]
    } else {
        return undefined
    }
}

function findTeamLeaderboardStats(sg, data) {
    return data.leaderboardStats.filter(ls => ls.statgroup_id === sg.id )
}

function filterDublicateLeaderboardStats(arr) {
    let newArr = []
    for (const ls of arr) {
        if (!newArr.find(x => x.statGroup_id === ls.statGroup_id
            && x.leaderboard_id === ls.leaderboard_id)
        ) {
            newArr.push(ls)
        }
    }
    return newArr
}

function factionSide(team) {
    const isAllies = team.every(p => (
        p.faction === 'british'
        || p.faction === 'aef'
        || p.faction === 'soviet'))

    const isAxis = team.every(p => (
        p.faction === 'west_german'
        || p.faction === 'german'))

    if (isAllies) {
        return 'allies'
    } else if (isAxis) {
        return 'axis'
    } else {
        return undefined
    }
}

function getTitleName(team, side) {
    let size =  team.length
    if (size < 2) {
        return undefined
    }
    if (side === 'allies') {
        return 'TeamOf' + size + 'Allies'
    } else if (side === 'axis') {
        return 'TeamOf' + size + 'Axis'
    }
}

function getTitleId(titleName, titles) {
    let obj = titles.leaderboards.find(t => t.name === titleName)
    if (obj) {
        return obj.id
    }
}

function getFactionName(x) {
    switch (x) {
        case 'soviet':
            return 'Soviet'
        case 'german':
            return 'German'
        case 'aef':
            return 'AEF'
        case 'british':
            return 'British'
        case 'west_german':
            return 'WestGerman'
        default:
            return undefined
    }
}

function getTitlesLeaderboardId(name, titles) {
    let obj = titles.leaderboards.find(obj => obj.name === name)
    return obj.id
}

function getPlayerStatGroupId(playerId, data) {
    let p = data.statGroups.find(obj => ( obj.type === 1
        && obj.members[0].profile_id === playerId
    ))
    if (p) {
        return p.id
    }
}

function getPlayerLeaderboardStat(statGroupId, leaderboardId, data) {
    return data.leaderboardStats.find(obj => (
        obj.statgroup_id === statGroupId
        && obj.leaderboard_id === leaderboardId
    ))
}

function guessRankings(playersArr, data, titles) {
    console.log('GUESSING RANKINGS')
    // debugger
    let arr = formatToNums(copyObj(playersArr))
    let teams = separateTeams(arr)
    for (const team of teams) {
        const side = factionSide(team)
        const titleName = getTitleName(team, side)
        const statGroup = findTeamStatGroup(team, data)
        // debugger
        if (statGroup && team.length > 1) {
            const titleId = getTitleId(titleName, titles)
            let teamLeaderboardStats = findTeamLeaderboardStats(
                statGroup, 
                data,
            )
            teamLeaderboardStats = filterDublicateLeaderboardStats(
                teamLeaderboardStats)
            let teamCurrentLeaderboardStat = teamLeaderboardStats
                .find(x => x.leaderboard_id === titleId)
            if (teamCurrentLeaderboardStat && teamCurrentLeaderboardStat.rank) {
                team.forEach(
                    obj => obj.ranking = teamCurrentLeaderboardStat.rank)
            }
        } else {
            for (let player of team) {
                let s = team.length
                let fn = getFactionName(player.faction)
                let matchTypeName = `${s}v${s}${fn}`
                let leaderboardId = getTitlesLeaderboardId(
                    matchTypeName, titles)

                let playerId = player.profileId
                if (playerId === undefined) {
                    continue
                }
                // debugger
                let playerStatGroupId = getPlayerStatGroupId(playerId, data)
                let pls = getPlayerLeaderboardStat(
                    playerStatGroupId, leaderboardId, data)
                if (pls && pls.rank) {
                    player.ranking = pls.rank
                }
            }
        }
        // console.log(team)
    }
    console.log(teams)
    return teams
}

// ======== index.js=========

function readSettings(fileLocation, callback) {
    // console.log('readSettings, fileLocation:', fileLocation)
    fileLocation = fileLocation.replace(/\\/, '\\\\')
    fs.readFile(fileLocation, 'utf-8', (err, data) => {
        if (err) {
            return
        }
        callback(data)
    })
}

// react components

function Settings({ settings, handleLogLocation, handleRankingFileLocation }) {
    return <div style={{ marginTop: '4em' }}>
        <SettingsInputDiv
            text="Log location:"
            settings={settings}
            settingsKey="logLocation"
            clickFun={handleLogLocation}
        />
        <SettingsInputDiv
            text="Ranking file location (for OBS):"
            settings={settings}
            settingsKey="rankingFileLocation"
            clickFun={handleRankingFileLocation}
        />
    </div>

}

function SettingsInputDiv({text, settings, settingsKey, clickFun}) {
    const locationStyle = {
        margin: '.2em 0 0 .2em',
        minWidth: '100%',
        minHeight: '1em',
    }
    const divStyle = {
        margin: '1rem 0',
        backgroundColor: '#616161',
        padding: '1em',
        borderRadius: '5px',
    }
    const buttonStyle = {
        padding: '0',
        margin: '0.2em 0',
        width: '25vw',
        cursor: 'pointer',
        borderRadius: '5px',
        backgroundColor: '#181818',
        border: '2px solid #181818',
        color: 'white',
        height: '1.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
    return <div style={divStyle}>
        <div style={{ fontWeight: 'bold' }} >{text}</div>
        <div style={locationStyle} >
            {settings && settings[settingsKey]
                ? settings[settingsKey]
                : ''
            }
        </div>
        <div style={buttonStyle} onClick={clickFun} >Select </div>
    </div>
}

function Player({ player, extraInfo, filterModes }) {

    const style = {
        width: '25%',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold',
    }

    const img = (
        <img
            style={{
                width: '2em',
                height: '2em',
            }}
            src={`./img/${commonName(player.faction)}.png`}
            alt={`${player.faction}`}
        />
    )

    const [showExtra, setShowExtra] = useState(false)

    const handleSetShowExtra = () => {
        setShowExtra(!showExtra)
    }

    return <div>
        <PlayerCurrentRank
            {...{
                style,
                player,
                img,
                handleSetShowExtra,
                showExtra,
                extraInfo,
            }}
        />
        {showExtra && (
            <PlayerExtraInfo
                {...{
                    style,
                    player,
                    img,
                    extraInfo,
                    filterModes,
                }}
            />
        )}
    </div>

}

function PlayerCurrentRank({
    style,
    player,
    img,
    handleSetShowExtra,
    showExtra,
    extraInfo,
}) {
    let country
    let steamId
    if (extraInfo && player.profileId) {
        for (const rank of extraInfo.ranks) {
            for (const member of rank.members) {
                if (member.profile_id == player.profileId) {
                    country = member.country
                    steamId = member.name.substring(7)
                    break
                }
            }
            if (country) {
                break
            }
        }
    }

    const link =
        'http://www.companyofheroes.com/'
        + 'leaderboards#profile/steam/'
        + steamId
        + '/standings'

    return <div style={{
        display: 'flex',
        alignItems: 'center',
    }}>
        <span style={style}>
            <i
                style={{ marginRight: '1rem', cursor: 'pointer' }}
                className={`fa fa-lg fa-caret-${showExtra ? 'down' : 'right'}`}
                onClick={handleSetShowExtra}
            />
            {player.ranking === '-1' || player.ranking === -1
                ? '-'
                : Number(player.ranking) + 1
            }
        </span>

        <span style={style}>{img}</span>

        <span style={style}>
            {country !== undefined ? (
                <img
                    style={{
                        width: '2em',
                    }}
                    src={`./img/contryFlags/${country}.png`}
                    alt={`${country}`}
                />
            ) : null}
        </span>

        <span
            style={steamId ? { ...style, cursor: 'pointer' } : { ...style }}
            onClick={() => (steamId ? shell.openExternal(link) : null)}
        >
            {player.name}
        </span>
    </div>

}

function Sorter({ style, text, sort, setSort }) {
    return <div
        style={{
            ...style,
            color: sort === text ? 'yellow' : 'gray',
        }}
        onClick={() => setSort(text)}
    >
        {text}
    </div>
}

function TitlesExtraInfo({style, sort, setSort}) {
    style = {
        ...style,
        fontSize: '80%',
        marginBottom: '0.5em',
        color: 'gray',
        cursor: 'pointer',
    }

    const arr = ['rank', 'type', 'win %', 'total games']

    return <div style={{
        display: 'flex',
        alignItems: 'flex-start',
    }}>
        {arr.map(s => <Sorter
                key={s}
                style={style}
                text={s}
                sort={sort}
                setSort={setSort}
            />
        )}
    </div>
}

function PlayerExtraInfo({ style, extraInfo, filterModes }) {
    const [sort, setSort] = useState('rank')
    const ranksArr = extraInfo && extraInfo.ranks
        .filter(x => {
            const a = x.name.toLowerCase()
            const b = filterModes.toLowerCase()

            // search returns  index of the first match between the regular
            // expression and the given string, or -1 if no match was found.
            return a.search(b) > -1 && x.rank > -1
            // return a.search(b) > -1
        })
        .sort((a, b) => a.rank - b.rank)

    style = {
        ...style,
        fontSize: '90%',
        marginRight: '0.5em',
    }
    return <div>
        {ranksArr && (
            <div style={{ margin: '1rem 0 1.5rem 0' }}>
                <hr />
                <div style={{ marginTop: '1rem' }}>

                    <TitlesExtraInfo
                        style={style}
                        sort={sort}
                        setSort={setSort}
                    />

                    {ranksArr.map((r, i) => {
                        let per = r.wins / (r.wins + r.losses) * 100
                        per = per.toFixed(0) + '%'
                        let totalGames = r.wins + r.losses

                        return (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                            }}>
                                <div style={style}>{r.rank}</div>
                                <Rank
                                    style={{
                                        ...style,
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                    }}
                                    rank={r}
                                />
                                <div style={style}>{per}</div>
                                <div style={style}>{totalGames}</div>
                            </div>
                        )
                    } )}
                </div>
            </div>
        )}
    </div>
}

function Members({ members }) {
    return <div style={{ margin: '0.5rem 0' }}>
        <hr />
        {members.map(m => (
            <div
                style={{
                    marginLeft: '1em',
                    fontSize: '0.9em',
                    cursor: 'pointer',
                    color: 'lime',
                }}
                key={m.name}
                onClick={() =>
                    shell.openExternal(
                        'http://www.companyofheroes.com/' +
                        'leaderboards#profile/steam/' +
                        m.name.substring(7) +
                        '/standings',
                    )
                }
            >
                <img
                    style={{
                        width: '1em',
                        marginRight: '1em',
                    }}
                    src={`./img/contryFlags/${m.country}.png`}
                    alt={`${m.country}`}
                />
                {m.alias}
            </div>
        ))}
    </div>

}

function Rank({ style, rank }) {
    const [showMembers, setShowMembers] = useState(false)
    function sw(x) {
        switch (x) {
            case 'Soviet':
                return 'sov'
            case 'German':
                return 'wer'
            case 'AEF':
                return 'usa'
            case 'British':
                return 'uk'
            case 'WestGerman':
                return 'okw'
            default:
                return x
        }
    }
    function betterRankName(rn) {
        let m = rn.match(/^\dv\d/)
        rn = rn.replace(/^(\dv\d)/, '')
        return m + ' ' + sw(rn)
    }

    const cl = `fa fa-lg fa-caret-${showMembers ? 'down' : 'right'}`

    return <div style={style}>
        {rank.members.length > 1
            ? <div>
                <span
                    onClick={() => setShowMembers(!showMembers)}
                    style={{ cursor: 'pointer' }}
                >
                    <i
                        style={{
                            color: 'lime',
                            marginRight: '.2em',
                        }}
                        className={cl}
                    />
                    {rank.name}
                </span>
                {showMembers && <Members members={rank.members} />}
            </div>
            : <div>{betterRankName(rank.name)}</div>
        }
    </div>

}

function Team({ filterModes, players, extraInfo }) {

    return <div style={{
        background: '#181818',
        padding: '0.5rem 1.5rem',
        borderRadius: '0.5rem',
        margin: '1rem 0',
    }} >
        {players.map((p, i) => (
            <Player
                key={p.profileId + i}
                player={p}
                filterModes={filterModes}
                extraInfo={extraInfo
                        && p.profileId ? extraInfo[p.profileId] : null}
            />
        ))}
    </div>
}

function Teams({ filterModes, players, extraInfo }) {

    let teams = [[], []]
    if (players) {
        players.forEach(p => {
            let teamIndex = p.slot % 2
            if (Number.isInteger(teamIndex)) {
                teams[teamIndex].push(p)
            }
        })
    }

    return players && players.length > 0
        ? <div>
            <Team
                players={teams[0]}
                filterModes={filterModes}
                extraInfo={extraInfo}
            />
            <Team
                players={teams[1]}
                filterModes={filterModes}
                extraInfo={extraInfo}
            />
        </div>
        : <div className="noInfo">
            <h1>no info in log file</h1>
        </div>

}

function Navbar({
    setSettingsView,
    settingsView,
    setFilterModes,
    filterModes,
}) {
    const styleNavbar = {
        backgroundColor: '#181818',
        position: 'fixed',
        top: '0',
        left: '0',
        height: '3em',
        width: '100vw',
        borderBottom: '2px solid black',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: '99999',
    }

    return <div style={
        !settingsView
            ? styleNavbar
            : { ...styleNavbar, justifyContent: 'flex-end' }
    }>
        {!settingsView && (
            <Filter
                filterModes={filterModes}
                setFilterModes={setFilterModes}
            />
        )}
        <i
            className={!settingsView
                ? 'fa fa-2x fa-cogs'
                : 'fa fa-2x fa-times'
            }
            style={{
                color: 'white',
                cursor: 'pointer',
                // marginRight: '1rem',
                marginRight: '5%',
            }}
            onClick={setSettingsView}
        />
    </div>
}

function Filter({ setFilterModes, filterModes }) {
    const filterHandler = e => {
        const text = e.target.value.trim()
        setFilterModes(text)
    }
    return <input
        style={{
            height: '2rem',
            background: '#181818',
            border: 'none',
            borderBottom: '1px solid white',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.8em',
        }}
        placeholder="filter modes"
        onChange={filterHandler}
        value={filterModes}
    />
}

function UpdateBar() {
    const [update, setUpdate] = useState(null)

    const isHigherVersion = (tag, current)=> {
        let arrTag = tag.split('.')
        let arrCurrent = current.split('.')
        for (let i = 0; i < arrCurrent.length; i++) {
            if (arrTag[i] > arrCurrent[i]) {
                return true
            } else if (arrTag[i] < arrCurrent[i]) {
                return false
            }
        }
        return false
    }

    if (updateCheckNotDone) {
        updateCheckNotDone = false
        console.log('CHECKING UPDATE')

        let url = 'https://api.github.com/repos/sepi4/myCeloJs/releases/latest'
        axios.get(url)
            .then(x => {
                // console.log('CHECK UPDATE, axios then!')
                if (x && x.data) {
                    // let newTagName = '1.8.8'
                    let newTagName = x.data.tag_name
                    if (isHigherVersion(newTagName, appVersion)) {
                        const data = x.data
                        if (data.assets[0]) {
                            setUpdate({
                                url: data.assets[0].browser_download_url,
                                tagName: newTagName,
                            })
                        }
                    }
                }
            })
    }

    const style = {
        height: '2em',
        width: '100%',
        backgroundColor: 'purple',
        position: 'fixed',
        bottom: 0,
        left: 0,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '80%',
    }

    const buttonStyle={
        display: 'inline',
        backgroundColor: 'purple',
        border: '.1em solid white',
        marginLeft: '1em',
        borderRadius: '5px',
        padding: '.1em .3em',
        color: 'white',
        cursor: 'pointer',
        fontSize: '1em',
    }

    return <div>
        {update
            ? <div style={style}>
                <span>update to version {update.tagName}</span>

                <button
                    style={buttonStyle}
                    onClick={() => {
                        shell.openExternal(update.url)
                    }}
                >download</button>

                <button
                    style={buttonStyle}
                    onClick={() => {
                        clipboard.writeText(update.url)
                    }}
                >copy link</button>
            </div>
            : null
        }
    </div>
}

function MainView({
    settingsView,
    settings,
    handleLogLocation,
    handleRankingFileLocation,
    info,
    extraInfo,
    filterModes,
}) {

    return <div>
        {!settingsView
            ? <Teams
                players={(info && info.players) ? info.players : null}
                extraInfo={extraInfo}
                filterModes={filterModes}
            />
            : <Settings
                settings={settings}
                handleLogLocation={handleLogLocation}
                handleRankingFileLocation={handleRankingFileLocation}
            />
        }
    </div>

}

function App() {
    const READ_LOG_INTERVAL = 3000

    const [info, setInfo] = useState({ players: null, fromFile: null, })
    const [extraInfo, setExtraInfo] = useState(null)
    const [settingsView, setSettingsView] = useState(false)
    const [settings, setSettings] = useState(null)
    const [filterModes, setFilterModes] = useState('')


    console.log("info", info)
    const checkLogData = data => {
        if (JSON.stringify(info.fromFile) !== JSON.stringify(data)) {
            setInfo({
                players: data,
                fromFile: data,
            })
            setExtraInfo(null)
            writeRankings(data, settings.rankingFileLocation, 'checkLogData')
        }
    }

    const writeNewRankingsFile = data => {
        setInfo({
            players: data,
            fromFile: data,
        })
        setExtraInfo(null)
        writeRankings(
            data,
            settings.rankingFileLocation,
            'writeNewRankingsFile'
        )
    }

    useEffect(() => {
        // initial readSettings location of log file
        if (settings === null) {
            readSettings('./settings.json', (data) => {
                setSettings(JSON.parse(data))
            })
            return
        // initial readLog
        } else if (info.players === null) {
            if (settings && settings.logLocation) {
                readLog(settings.logLocation, checkLogData)
            }
        } else if (extraInfo === null && info.players.length > 0) {
            getExtraInfo(info.players, (data, isReplay, teams) => {
                setExtraInfo(data)
                // writeRankings(data, settings.rankingFileLocation)
                if (isReplay) {
                    let newPlayers = []
                    teams.forEach(team => {
                        team.forEach(player => {
                            newPlayers.push(player)
                        })
                    })
                    setInfo({
                        players: newPlayers,
                        fromFile: info.fromFile,
                    })
                    writeRankings(
                        newPlayers,
                        settings.rankingFileLocation,
                        'useEffect'
                    )

                }
            })
        }

        const intervalId = setInterval(() => {
            if (settings && settings.logLocation) {
                readLog(settings.logLocation, checkLogData)
            }
        }, READ_LOG_INTERVAL)

        return () => clearInterval(intervalId)
    })

    useEffect(() => {
        console.log('settings changed')
        if (settings && settings.logLocation) {
            readLog(settings.logLocation, writeNewRankingsFile)
        }
    }, [settings])

    const handleLogLocation = () => {
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Logs', extensions: ['log'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        }).then(function (file) {
            if (file !== undefined && file.filePaths[0]) {
                const newSetting = {
                    ...settings,
                    logLocation: file.filePaths[0],
                }
                fs.writeFile(
                    './settings.json',
                    JSON.stringify(newSetting, null, 4),
                    'utf-8',
                    // (err, data) => {
                    () => {
                        setSettings(newSetting)
                    },
                )
            }
        })
    }

    const handleRankingFileLocation = () => {
        dialog.showSaveDialog({
            filters: [{
                name: 'txt',
                extensions: ['txt']
            }]
        }).then((obj) => {
            if (obj !== undefined && obj.filePath) {
                const newSetting = {
                    ...settings,
                    rankingFileLocation: obj.filePath,
                }
                fs.writeFile(
                    './settings.json',
                    JSON.stringify(newSetting, null, 4),
                    'utf-8',
                    () => {
                        setSettings(newSetting)
                    },
                )
            }
        })
    }

    const handleSetSettingsView = () => {
        setSettingsView(!settingsView)
        if (settings && settings.logLocation) {
            readLog(settings.logLocation, checkLogData)
        }
    }

    return <main style={{ marginTop: '4em' }} >
        <Navbar
            extraInfo={extraInfo}
            settingsView={settingsView}
            setSettingsView={handleSetSettingsView}
            setFilterModes={setFilterModes}
            filterModes={filterModes}
        />
        <MainView
            settingsView={settingsView}
            settings={settings}
            handleLogLocation={handleLogLocation}
            handleRankingFileLocation={handleRankingFileLocation}
            info={info}
            extraInfo={extraInfo}
            filterModes={filterModes}
        />
        <UpdateBar />
    </main>
}

ReactDOM.render(<App />, document.getElementById('root'))
