import React from 'react'
import { useSelector } from 'react-redux'

import Team from './Teams/Team'
import Settings from './Settings/Settings'


function MainView() {
    const settingsView = useSelector(state => state.settingsView)
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

    if (settingsView) {
        return <Settings />
    }
    if (players && players.length > 0) {
        return <div>
            <Team players={teams[0]} teamIndex={0} />
            <Team players={teams[1]} teamIndex={1} />
        </div> 
    }
    return <div>
        <h1>no info in log file</h1>
    </div>
}

export default MainView