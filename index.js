import { readLog, getExtraInfo, writeRankings, commonName } from './logic'
const { useEffect, useState } = React


function Player({ player, extraInfo }) {
    let rankings = []
    let rows = []
    console.log('extraInfo', extraInfo)
    if (extraInfo) {
        rows.push(<tr key={player.id + 'extra'}>
            <td className="name">{player.name} <img
                style={{ margin: '0 0 0 1rem' }}
                className="flag"
                src={`./img/${commonName(player.faction)}.png`}
                alt={`${player.faction}`}>
            </img>
            </td>
            <td></td>
            <td></td>
        </tr >)

        if (extraInfo[player.id] && extraInfo[player.id].ranks.length > 0) {
            extraInfo[player.id].ranks
                .sort((a, b) => a.rank - b.rank)
                .forEach((r, i) => {
                    rows.push(<tr key={player.id + i}>
                        <td className="ranking"></td>
                        <td className="faction">{r.rank}</td>
                        <td className="name">{r.name}</td>
                    </tr>)
                })
        }
    } else {
        rows.push(
            <tr key={player.id + 'noextra'}>
                <td className="ranking">
                    {player.ranking === '-1' ? '-' : player.ranking}
                </td>
                <td className="faction">
                    <img
                        className="flag"
                        src={`./img/${commonName(player.faction)}.png`}
                        alt={`${player.faction}`}>
                    </img>
                </td>
                <td className="name">{player.name}</td>
            </tr>
        )
    }

    // console.log(rows)
    return rows.map(r => r)
}

function Team({ players, title, extraInfo }) {
    return <div className="team">
        {title && <div>
            <p>
                {title}
            </p>
            <hr />
        </div>
        }
        <table>
            <tbody>
                {players.map((p, i) => <Player
                    extraInfo={title ? extraInfo : null}
                    key={p.id + i}
                    player={p}
                />)}
            </tbody>
        </table>
    </div>
}

function Teams({ players, extraInfo, extraView }) {


    let team1 = []
    let team2 = []
    if (players) {
        for (const p of players) {
            if (p.slot % 2 === 0) {
                team1.push(p)
            } else {
                team2.push(p)
            }
        }
    }


    return <div>
        <Team
            title={extraView ? 'Team 1' : null}
            players={team1}
            extraInfo={extraInfo}
        />
        <Team
            title={extraView ? 'Team 2' : null}
            players={team2}
            extraInfo={extraInfo}
        />
    </div>
}

function Navbar({ extraInfo, extraView, setExtraView }) {
    const text = extraView ? 'Basic' : 'Extra'
    return <div className="navbar">
        <button
            disabled={!extraInfo}
            className="button" onClick={() => console.log('button')}
            onClick={() => setExtraView(!extraView)}
        >
            {text}
        </button>
    </div>
}

function App() {
    const [readLogInterval, setReadLogInterval] = useState(5000)
    const [players, setPlayers] = useState(null)
    const [extraInfo, setExtraInfo] = useState(null)
    const [extraView, setExtraView] = useState(false)

    const checkLogData = (data) => {
        if (JSON.stringify(players) !== JSON.stringify(data)) {
            setPlayers(data)
            setExtraInfo(null)
            writeRankings(data)
        }
    }

    useEffect(() => {
        // console.log('App useEffect')

        // initial readLog
        if (players === null) {
            readLog(checkLogData)
        } else if (extraInfo === null && players.length > 0) {
            getExtraInfo(players, (data) => {
                setExtraInfo(data)
            })
        }

        const intervalId = setInterval(() => {
            readLog(checkLogData)
        }, readLogInterval)

        return () => clearInterval(intervalId)
    })

    console.log('render App')
    console.log(extraInfo)
    console.log(players)
    return (
        <main id="info">
            {players && players.length > 0
                ? <div>
                    <Navbar
                        extraView={extraView}
                        extraInfo={extraInfo}
                        setExtraView={setExtraView}
                    />
                    <Teams
                        extraView={extraView}
                        players={players}
                        extraInfo={extraInfo}
                    />
                </div>
                : <div className="noInfo"><h1>no info in log file</h1></div>
            }
        </main>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))