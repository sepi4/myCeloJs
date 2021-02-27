import React from 'react'
import { useSelector } from 'react-redux'

import Team from './Teams/Team'
import Settings from './Settings/Settings'

// import { remote } from 'electron'
// const { BrowserWindow } = remote

function MainView() {
    const settingsView = useSelector(state => state.settingsView)
    let teams = [[], []]
    let players = useSelector(state => state.players)

    if (players) {
        players.forEach(p => {
            teams[p.teamSlot].push(p)
        })
    }

    // return (
    //     <button
    //         onClick={() => {
    //             // window.open('https://github.com', '_blank', 'nodeIntegration=no')

    //             let win = new BrowserWindow({
    //                 width: 1920,
    //                 height: 1080,
    //                 transparent: true,
    //                 frame: false
    //             })
    //             console.log(__dirname, process.cwd())
    //             win.loadURL(`file://${process.cwd()}/localhostFiles/rankings.html`)

    //             win.setAlwaysOnTop(true, 'screen');

    //             win.show()
    //         }}
    //     >button</button>
    // )

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