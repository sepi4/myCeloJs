import React from 'react'
import { useSelector, } from 'react-redux'

import Team from './Team'

function Teams() {
    let teams = [[], []]
    let players = useSelector(state => state.players)

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
            <Team players={teams[0]} />
            <Team players={teams[1]} />
        </div>
        : <div className="noInfo">
            <h1>no info in log file</h1>
        </div>

}

export default Teams