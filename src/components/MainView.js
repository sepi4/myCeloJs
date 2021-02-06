import React from 'react'
import { useSelector } from 'react-redux'

import Teams from './Teams'
import Settings from './Settings'


function MainView() {
    const settingsView = useSelector(state => state.settingsView)

    console.log('MainView')
    return <div>
        {!settingsView
            ? <Teams />
            : <Settings />
        }
    </div>
}

export default MainView