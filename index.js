import { readLog, getExtraInfo, writeRankings } from './logic'
const { useEffect, useState } = React


function Player({ player }) {
    return <tr>
        <td className="ranking">{player.ranking}</td>
        <td className="faction">{player.faction}</td>
        <td className="name">{player.name}</td>
    </tr>
}

function Team({ players, title }) {
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
                {players.map((p) => <Player key={p.id} player={p} />)}
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
        />
        <Team
            title={extraView ? 'Team 2' : null}
            players={team2}
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