import React from 'react'
import { render } from 'react-dom'
import App from './App'
import './index.css'

import { createStore } from 'redux'
import { Provider } from 'react-redux'


function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(
    require.context(
        '../img/countryFlags/',
        false,
        /\.(png|jpe?g|svg)$/
    )
)

let countryFlags = {}
images.forEach(x => {
    countryFlags[x.default.substring(4, 6)] = x.default
})

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create 
// our own root node in the body element before rendering into it
let root = document.createElement('div')

import reducer from './reducer'
import { byRank } from './functions/sorters'

function getLocal(key, def) {
    const str = localStorage.getItem(key)
    if (str !== undefined && str !== null) {
        return JSON.parse(str)
    }
    return def
}

let store = createStore(reducer, {

    settingsView: false,
    settings: null,
    logCheckInterval: getLocal('logCheckInterval', 3),


    autoLogChecking: getLocal('autoLogChecking', true),

    updateCheckDone: false,

    appLocation: process.cwd(),

    players: null,
    fromFile: null,
    extraInfo: null,

    navButtons: getLocal(
        'navButtons',
        { all: false, table: false }
    ),

    openInfos: [
        [false, false, false, false,],
        [false, false, false, false,],
    ],

    countryFlags,

    sorter: {
        fun: byRank,
        name: 'byRank',
        reversed: false,
    },

})

root.id = 'root'
document.body.appendChild(root)

render(
    <Provider store={store} >
        <App />
    </Provider>,
    document.getElementById('root')
)
