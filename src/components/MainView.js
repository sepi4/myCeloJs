import React from 'react'
import { useSelector } from 'react-redux'

import Team from './Teams/Team'
import Settings from './Settings/Settings'

import getText from '../functions/getText'

function MainView() {
    const settingsView = useSelector(state => state.settingsView)
    let teams = [[], []]
    let state = useSelector(state => state)
    let players = state.players
    const settings = state.settings
    const lg = settings ? settings.language : 'en'


    if (players) {
        players.forEach(p => {
            teams[p.teamSlot].push(p)
        })
    }


    if (settingsView) {
        return <Settings />
    }
    // haven't add log location
    if (settings && !settings.logLocation) {
        return <div>
            <h2>{getText('add_log_location', lg)}</h2>
        </div>
    }
    if (players && players.length > 0) {
        return <div>
            <Team players={teams[0]} teamIndex={0} />
            <Team players={teams[1]} teamIndex={1} />
        </div>
    }
    return <div>
        <h2>{getText('no_info', lg)}</h2>
    </div>
}

export default MainView