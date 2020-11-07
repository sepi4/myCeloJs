import {
    readLog,
    getExtraInfo,
    writeRankings,
    commonName,
    React,
    ReactDOM
} from './logic'
// import settingsJson from './settings.json'

const { useEffect, useState } = React
const { dialog } = require('electron').remote
const { shell } = require('electron')
const fs = require('fs')


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
    const inputStyle = {
        margin: '0.4em 0',
        borderRadius: '5px',
        border: '0.1em solid white',
        padding: '.2em',
        minWidth: '100%',
        minHeight: '1em',
    }
    return <div style={{ margin: '1rem 0' }}>
        <div style={{ fontWeight: 'bold' }} >{text}</div>
        <div style={inputStyle} >
            {settings && settings[settingsKey]
                ? settings[settingsKey]
                : ''
            }
        </div>
        <div style={buttonStyle} onClick={clickFun} >Select </div>
    </div>
}

function Player({ player, extraInfo, filterModes }) {
    const link =
        'http://www.companyofheroes.com/' +
        'leaderboards#profile/steam/' +
        player.id +
        '/standings'

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
                link,
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
                    link,
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
    link,
    img,
    handleSetShowExtra,
    showExtra,
    extraInfo,
}) {
    let country
    if (extraInfo && player.id) {
        for (const rank of extraInfo.ranks) {
            for (const member of rank.members) {
                if (member.name.substring(7) === player.id) {
                    country = member.country
                    break
                }
            }
            if (country) {
                break
            }
        }
    }

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
            {player.ranking === '-1' ? '-' : player.ranking}
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
            style={player.id ? { ...style, cursor: 'pointer' } : { ...style }}
            onClick={() => (player.id ? shell.openExternal(link) : null)}
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
                key={p.id + i}
                player={p}
                filterModes={filterModes}
                extraInfo={extraInfo && p.id ? extraInfo[p.id] : null}
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

    const [players, setPlayers] = useState(null)
    const [extraInfo, setExtraInfo] = useState(null)
    const [settingsView, setSettingsView] = useState(false)
    // const [settings, setSettings] = useState(settingsJson)
    const [settings, setSettings] = useState(null)
    const [filterModes, setFilterModes] = useState('')

    const checkLogData = data => {
        if (JSON.stringify(players) !== JSON.stringify(data)) {
            setPlayers(data)
            setExtraInfo(null)
            writeRankings(data, settings.rankingFileLocation)
        }
    }

    useEffect(() => {
        // initial readSettings location of log file
        if (settings === null) {
            readSettings('./settings.json', (data) => {
                setSettings(JSON.parse(data))
            })
            return
            // initial readLog
        } else if (players === null) {
            readLog(settings.logLocation, checkLogData)
        } else if (extraInfo === null && players.length > 0) {
            getExtraInfo(players, data => {
                setExtraInfo(data)
            })
        }

        const intervalId = setInterval(() => {
            readLog(settings.logLocation, checkLogData)
        }, READ_LOG_INTERVAL)

        return () => clearInterval(intervalId)
    })

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
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'txt', extensions: ['txt'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        }).then((obj) => {
            if (obj !== undefined && obj.filePaths[0]) {
                const newSetting = {
                    ...settings,
                    rankingFileLocation: obj.filePaths[0],
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
                players={players}
                extraInfo={extraInfo}
                filterModes={filterModes}
            />
        }
    </main>
    
}

ReactDOM.render(<App />, document.getElementById('root'))
