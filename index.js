import { readLog, getExtraInfo, writeRankings, commonName } from './logic'
import settingsJson from './settings.json'
const { useEffect, useState } = React
const { dialog } = require('electron').remote
const { shell } = require('electron')
const fs = require('fs')

function Settings({ settings, handleLogLocation }) {
    const buttonStyle = {
        padding: '0',
        margin: '0',
        width: '25vw',
        border: '2px solid white',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderRadius: '5px',
        backgroundColor: '#181818',
        color: 'white',
        height: '2rem',
    }

    return (
        <div style={{ marginTop: '4rem' }}>
            <div
                style={{
                    fontWeight: 'bold',
                    borderBottom: '2px solid black',
                }}
            >
                Log location:
            </div>

            <div
                style={{
                    margin: '0.5rem 0',
                }}
            >
                {settings.logLocation}
            </div>

            <div>
                <button style={buttonStyle} onClick={handleLogLocation}>
                    Select
                </button>
            </div>
        </div>
    )
}

function Player({ player, extraInfo, filterModes }) {
    const link =
        'http://www.companyofheroes.com/' +
        'leaderboards#profile/steam/' +
        player.id +
        '/standings'

    const style = {
        width: '33.3%',
        display: 'inline-block',
        color: 'white',
        fontWeight: 'bold',
    }

    const img = (
        <img
            style={{
                width: '2rem',
                height: '2rem',
                position: 'relative',
                top: '0.6rem',
            }}
            src={`./img/${commonName(player.faction)}.png`}
            alt={`${player.faction}`}
        />
    )

    const [showExtra, setShowExtra] = useState(false)

    const handleSetShowExtra = () => {
        setShowExtra(!showExtra)
    }

    return (
        <div>
            <PlayerCurrentRank
                {...{
                    style,
                    player,
                    link,
                    img,
                    handleSetShowExtra,
                    showExtra,
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
    )
}

function Members({ members }) {
    return (
        <div style={{ margin: '0.5rem 0' }}>
            <hr />
            {members.map(m => (
                <div
                    style={{
                        marginLeft: '1rem',
                        fontSize: '0.9rem',
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
                    {m.alias}
                </div>
            ))}
        </div>
    )
}

function Rank({ style, r }) {
    const [showMembers, setShowMembers] = useState(false)

    return (
        <div style={style}>
            {r.members.length > 1 ? (
                <div>
                    <span
                        onClick={() => setShowMembers(!showMembers)}
                        style={{ cursor: 'pointer' }}
                    >
                        <i
                            style={{
                                color: 'lime',
                                marginRight: '1rem',
                            }}
                            className={`fa fa-lg fa-caret-${
                                showMembers ? 'down' : 'right'
                            }`}
                        />
                        {r.name}
                    </span>
                    {showMembers && <Members members={r.members} />}
                </div>
            ) : (
                <div>{r.name}</div>
            )}
        </div>
    )
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

    return (
        <div>
            {ranksArr && (
                <div style={{ margin: '1rem 0 1.5rem 0' }}>
                    <hr />
                    <div style={{ marginTop: '1rem' }}>
                        {ranksArr.map((r, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <div style={style}>{r.rank}</div>
                                <Rank
                                    style={{ ...style, width: '66%' }}
                                    r={r}
                                />
                                {/* <div style={style}></div> */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function PlayerCurrentRank({
    style,
    player,
    link,
    img,
    handleSetShowExtra,
    showExtra,
}) {
    return (
        <div
            style={{
                margin: '0 0 1rem 0',
            }}
        >
            <div style={style}>
                <i
                    style={{ marginRight: '1rem', cursor: 'pointer' }}
                    className={`fa fa-lg fa-caret-${
                        showExtra ? 'down' : 'right'
                    }`}
                    onClick={handleSetShowExtra}
                />
                {player.ranking === '-1' ? '-' : player.ranking}
            </div>
            <div style={style}>{img}</div>
            <div
                style={
                    player.id ? { ...style, cursor: 'pointer' } : { ...style }
                }
                onClick={() => (player.id ? shell.openExternal(link) : null)}
            >
                {player.name}
            </div>
        </div>
    )
}

function Team({ filterModes, players, extraInfo }) {
    return (
        <div
            style={{
                background: '#181818',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                margin: '1rem 0',
            }}
        >
            {players.map((p, i) => (
                <Player
                    key={p.id + i}
                    player={p}
                    filterModes={filterModes}
                    extraInfo={extraInfo && p.id ? extraInfo[p.id] : null}
                />
            ))}
        </div>
    )
}

function Teams({ filterModes, players, extraInfo }) {
    let teams = [[], []]
    if (players) {
        players.forEach(p => {
            teams[p.slot % 2].push(p)
        })
    }

    return players && players.length > 0 ? (
        <div>
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
    ) : (
        <div className="noInfo">
            <h1>no info in log file</h1>
        </div>
    )
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
        height: '3rem',
        width: '100vw',
        borderBottom: '2px solid black',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: '99999',
    }

    return (
        <div
            style={
                !settingsView
                    ? styleNavbar
                    : { ...styleNavbar, justifyContent: 'flex-end' }
            }
        >
            {!settingsView && (
                <Filter
                    filterModes={filterModes}
                    setFilterModes={setFilterModes}
                />
            )}
            <i
                className={
                    !settingsView ? 'fa fa-2x fa-cogs' : 'fa fa-2x fa-times'
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
    )
}

function Filter({ setFilterModes, filterModes }) {
    const filterHandler = e => {
        const text = e.target.value.trim()
        setFilterModes(text)
    }
    return (
        <input
            style={{
                height: '2rem',
                background: '#181818',
                border: 'none',
                borderBottom: '1px solid white',
                color: 'white',
                fontWeight: 'bold',
            }}
            placeholder="filter modes"
            onChange={filterHandler}
            value={filterModes}
        />
    )
}

function App() {
    const READ_LOG_INTERVAL = 3000

    const [players, setPlayers] = useState(null)
    const [extraInfo, setExtraInfo] = useState(null)
    const [settingsView, setSettingsView] = useState(false)
    const [settings, setSettings] = useState(settingsJson)
    const [filterModes, setFilterModes] = useState('')

    const checkLogData = data => {
        if (JSON.stringify(players) !== JSON.stringify(data)) {
            setPlayers(data)
            setExtraInfo(null)
            writeRankings(data)
        }
    }

    useEffect(() => {
        // initial readLog
        if (players === null) {
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
        dialog
            .showOpenDialog({
                properties: ['openFile'],
                filters: [
                    { name: 'Logs', extensions: ['log'] },
                    { name: 'All Files', extensions: ['*'] },
                ],
            })
            .then(function(file) {
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

    const handleSetSettingsView = () => {
        setSettingsView(!settingsView)
        readLog(settings.logLocation, checkLogData)
    }

    console.log({ players, extraInfo, settingsView, settings, filterModes })
    return (
        <main
            style={{
                marginTop: '4rem',
            }}
        >
            <Navbar
                extraInfo={extraInfo}
                settingsView={settingsView}
                setSettingsView={handleSetSettingsView}
                setFilterModes={setFilterModes}
                filterModes={filterModes}
            />

            {settingsView ? (
                <Settings
                    settings={settings}
                    handleLogLocation={handleLogLocation}
                />
            ) : (
                <Teams
                    players={players}
                    extraInfo={extraInfo}
                    filterModes={filterModes}
                />
            )}
        </main>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
