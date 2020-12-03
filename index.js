import {
    readLog,
    getExtraInfo,
    writeRankings,
    commonName,
    React,
    ReactDOM
} from './logic'
let appVersion = require('electron').remote.app.getVersion();
document.title = 'sepi-celo ' + appVersion

// import settingsJson from './settings.json'

const { useEffect, useState } = React
const { dialog, clipboard } = require('electron').remote

const { shell } = require('electron')
const axios = require('axios')
const fs = require('fs')

let updateCheckNotDone = true

function readSettings(fileLocation, callback) {
    console.log('readSettings')
    fileLocation = fileLocation.replace(/\\/, '\\\\')
    fs.readFile(fileLocation, 'utf-8', (err, data) => {
        if (err) {
            return
        }
        callback(data)
    })
}

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
            <PlayerOtherRanks
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
                : player.ranking
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

function PlayerOtherRanks({ style, extraInfo, filterModes }) {
    const ranksArr =
        extraInfo &&
        extraInfo.ranks
            .filter(x => {
                const a = x.name.toLowerCase()
                const b = filterModes.toLowerCase()
                return a.search(b) > -1
            })
            .sort((a, b) => a.rank - b.rank)

    return <div>
        {ranksArr && (
            <div style={{ margin: '1rem 0 1.5rem 0' }}>
                <hr />
                <div style={{ marginTop: '1rem' }}>
                    {ranksArr.map((r, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                        }}>
                            <div style={style}>{r.rank}</div>
                            <Rank style={{ ...style, width: '66%' }} rank={r} />
                        </div>
                    ))}
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
                            marginRight: '1rem',
                        }}
                        className={`fa fa-lg fa-caret-${showMembers ? 'down' : 'right'}`}
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
                extraInfo={extraInfo && p.profileId ? extraInfo[p.profileId] : null}
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
            className={!settingsView ? 'fa fa-2x fa-cogs' : 'fa fa-2x fa-times'}
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

function App() {
    const READ_LOG_INTERVAL = 3000


    const [info, setInfo] = useState({
        players: null,
        fromFile: null,
    })
    const [extraInfo, setExtraInfo] = useState(null)
    const [settingsView, setSettingsView] = useState(false)
    const [settings, setSettings] = useState(null)
    const [filterModes, setFilterModes] = useState('')


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
        writeRankings(data, settings.rankingFileLocation, 'writeNewRankingsFile')
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
            readLog(settings.logLocation, checkLogData)
        } else if (extraInfo === null && info.players.length > 0) {
            getExtraInfo(info.players, (data, isReplay, teams) => {
                setExtraInfo(data)
                // writeRankings(data, settings.rankingFileLocation)
                if (isReplay) {
                    console.log('if isReplay')
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
                    writeRankings(newPlayers, settings.rankingFileLocation, 'useEffect')

                }
            })
        }

        const intervalId = setInterval(() => {
            readLog(settings.logLocation, checkLogData)
        }, READ_LOG_INTERVAL)

        return () => clearInterval(intervalId)
    })

    useEffect(() => {
        console.log('settings changed')
        if (settings) {
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
            console.log(obj)
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
        if (settings) {
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

        {settingsView
            ? <Settings
                settings={settings}
                handleLogLocation={handleLogLocation}
                handleRankingFileLocation={handleRankingFileLocation}
            />
            : <Teams
                players={(info && info.players) ? info.players : null}
                extraInfo={extraInfo}
                filterModes={filterModes}
            />
        }
        <UpdateBar />

    </main>
    
}

function UpdateBar() {
    const [updateLink, setUpdateLink] = useState(null)

    if (updateCheckNotDone) {
        updateCheckNotDone = false
        console.log('CHECK UPDATE')

        axios.get('https://api.github.com/repos/sepi4/myCeloJs/releases/latest')
            .then(x => {
                // console.log('CHECK UPDATE, axios then!')
                if (x && x.data) {
                    if (x.data.tag_name !== appVersion) {
                        const data = x.data
                        if (data.assets[0]) {
                            setUpdateLink(data.assets[0].browser_download_url)
                        }
                        // let options = {
                        //     buttons: ['Download', 'Cancel'],
                        //     message: "Update can be downloaded",
                        //     detail: 'from: https://github.com/sepi4/myCeloJs'
                        // }
                        // dialog.showMessageBox(null, options)
                        //     .then((response) => {
                        //         if (response.response === 0) {
                        //             // shell.openExternal('https://github.com/sepi4/myCeloJs')
                        //             shell.openExternal(data.assets[0].browser_download_url)
                        //         }
                        //     })
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
        {updateLink
            ? <div style={style}>
                <span>update is available</span>

                <button
                    style={buttonStyle}
                    onClick={() => {
                        shell.openExternal(updateLink)
                    }}
                >download</button>

                <button
                    style={buttonStyle}
                    onClick={() => {
                        clipboard.writeText(updateLink)
                    }}
                >copy link</button>
            </div>
            : null
        }
    </div> 
}

ReactDOM.render(<App />, document.getElementById('root'))