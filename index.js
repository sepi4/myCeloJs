import { readLog, getExtraInfo, writeRankings, commonName } from './logic'
const { useEffect, useState } = React
import settingsJson from './settings.json'
const user = require('os').userInfo()
const { dialog } = require('electron').remote
const { shell } = require('electron')
const fs = require('fs')
// const { Button } = ReactBootstrap

function Settings({ settings, handleLogLocation }) {

    const logExists = settings.logLocation.length > 0
    return <div style={{ marginTop: '4rem' }}>
        <div style={{
            fontWeight: 'bold',
            borderBottom: '2px solid black',
        }}>
            Log location:
        </div>

        <div style={{
            margin: '0.5rem 0',
        }}>
            {settings.logLocation}
        </div>

        <div>
            <button
                className="button"
                style={{
                    height: '2rem',
                }}
                onClick={handleLogLocation}
            >Select</button>
        </div>
    </div>
}

function Player({ player, extraInfo, filterModes }) {

    const link = 'http://www.companyofheroes.com/'
        + 'leaderboards#profile/steam/'
        + player.id
        + '/standings'

    const style = {
        width: "33.3%",
        display: "inline-block",
        color: 'white',
        fontWeight: 'bold',
    }

    const img = <img
        style={{
            width: '2rem',
            height: '2rem',
            position: 'relative',
            top: '0.6rem',
        }}
        src={`./img/${commonName(player.faction)}.png`}
        alt={`${player.faction}`}>
    </img>

    if (extraInfo) {
        return <PlayerExtra {...{
            style,
            player,
            link,
            img,
            extraInfo,
            filterModes
        }} />
    } else {
        return <PlayerBasic {...{ style, player, link, img }} />
    }
}

function PlayerExtra({ style, player, link, img, extraInfo, filterModes }) {
    const ranksArr = extraInfo && extraInfo.ranks
        .filter(x => {
            const a = x.name.toLowerCase()
            const b = filterModes.toLowerCase()
            return a.search(b) > -1
        })
        .sort((a, b) => a.rank - b.rank)

    return <div>
        <PlayerBasic {...{ style, player, link, img }} />
        <hr />
        {
            ranksArr && <div style={{ margin: '1rem 0 1.5rem 0' }}>
                {ranksArr
                    .map((r, i) => <div key={i}>
                        <div style={style}>{r.rank}</div>
                        <div style={style}>{r.name}</div>
                        <div style={style}></div>
                    </div>)
                }
            </div>
        }
    </div>
}

function PlayerBasic({ style, player, link, img }) {
    return <div style={{
        margin: "0 0 1rem 0",
    }}>
        <div style={style}>
            {player.ranking === '-1' ? '-' : player.ranking}
        </div>
        <div style={style}>
            {img}
        </div>
        <div
            style={player.id ? { ...style, cursor: "pointer" } : { ...style }}
            onClick={() => player.id ? shell.openExternal(link) : null}
        >
            {player.name}
        </div>
    </div>
}

function Team({ filterModes, players, extraInfo }) {
    return <div style={{
        background: "#181818",
        padding: '0.5rem 1.5rem',
        borderRadius: '0.5rem',
        margin: '1rem 0',
    }}>
        {players.map((p, i) => <Player
            key={p.id + i}
            player={p}
            filterModes={filterModes}
            extraInfo={extraInfo && p.id ? extraInfo[p.id] : null}

        />)}
    </div>
}

function Teams({ filterModes, players, extraInfo, extraView }) {
    let teams = [[], []]
    if (players) {
        players.forEach((p, i) => { teams[p.slot % 2].push(p) })
    }

    return players && players.length > 0
        ? <div>
            <Team
                players={teams[0]}
                filterModes={filterModes}
                extraInfo={extraView ? extraInfo : null}
            />
            <Team
                players={teams[1]}
                filterModes={filterModes}
                extraInfo={extraView ? extraInfo : null}
            />
        </div>
        : <div className="noInfo">
            <h1>no info in log file</h1>
        </div>
}

function Navbar({
    extraInfo,
    extraView,
    setExtraView,
    setSettingsView,
    settingsView,
    setFilterModes,
    filterModes
}) {
    const styleNavbar = {
        backgroundColor: "#181818",
        position: "fixed",
        top: "0",
        left: "0",
        height: "3rem",
        width: "100vw",
        borderBottom: "2px solid black",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
    }

    const text = extraView ? 'Basic' : 'Extra'
    return <div style={styleNavbar}>
        {!settingsView && extraInfo
            && <button
                className="button"
                onClick={setExtraView}
            >
                {text}
            </button>
        }
        {!settingsView && extraView
            && <Filter
                filterModes={filterModes}
                setFilterModes={setFilterModes}
            />
        }
        <img
            style={{
                height: '60%',
                padding: '2px',
                border: '2px solid white',
                borderRadius: '5px',
                cursor: 'pointer',
            }}
            src='./img/settings.png'
            onClick={setSettingsView}
        />
    </div>
}

function Filter({ setFilterModes, filterModes }) {
    const filterHandler = (e) => {
        const text = e.target.value.trim()
        setFilterModes(text)
    }
    return <input
        style={{
            height: '2rem',
            background: "#181818",
            border: 'none',
            borderBottom: '1px solid white',
            color: 'white',
            fontWeight: 'bold',
        }}
        placeholder='filter modes'
        onChange={filterHandler}
        value={filterModes}
    />
}

function App() {
    const READ_LOG_INTERVAL = 3000

    const [players, setPlayers] = useState(null)
    const [extraInfo, setExtraInfo] = useState(null)
    const [extraView, setExtraView] = useState(false)
    const [settingsView, setSettingsView] = useState(false)
    const [settings, setSettings] = useState(settingsJson)
    const [filterModes, setFilterModes] = useState('')

    const checkLogData = (data) => {
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
            getExtraInfo(players, (data) => {
                setExtraInfo(data)
            })
        }

        const intervalId = setInterval(() => {
            readLog(settings.logLocation, checkLogData)
        }, READ_LOG_INTERVAL)

        return () => clearInterval(intervalId)
    }, [players, extraInfo, extraView, settings])


    const handleLogLocation = () => {
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Logs', extensions: ['log'], },
                { name: 'All Files', extensions: ['*'] }
            ]
        }).then(
            function (file) {
                if (file !== undefined && file.filePaths[0]) {
                    const newSetting = {
                        ...settings,
                        logLocation: file.filePaths[0],
                    }
                    fs.writeFile(
                        './settings.json',
                        JSON.stringify(newSetting, null, 4),
                        "utf-8",
                        (err, data) => {
                            setSettings(newSetting)
                        }
                    )
                }
            }
        )
    }

    return (
        <main style={{
            marginTop: '4rem',
        }}>
            <Navbar
                extraView={extraView}
                setExtraView={() => setExtraView(!extraView)}
                extraInfo={extraInfo}
                settingsView={settingsView}
                setSettingsView={() => setSettingsView(!settingsView)}
                setFilterModes={setFilterModes}
                filterModes={filterModes}
            />

            {settingsView
                ? <Settings
                    settings={settings}
                    handleLogLocation={handleLogLocation}
                />
                : <Teams
                    players={players}
                    extraInfo={extraInfo}
                    extraView={extraView}
                    filterModes={filterModes}
                />
            }

        </main>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
