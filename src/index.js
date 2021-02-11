import React from 'react'
import { render } from 'react-dom'
import App from './App'
import './index.css'

function importAll(r) {
  return r.keys().map(r);
}

console.log('index.js running')
const images = importAll(
    require.context(
        '../img/countryFlags/',
        false,
        /\.(png|jpe?g|svg)$/
    )
)

let countryFlags = {}
images.forEach(x => {
    countryFlags[x.default.substring(4,6)] = x.default
})

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div')

import { createStore } from 'redux'
import { Provider } from 'react-redux'

// Reducer
function reducer( state, action) {
    switch (action.type) {
        case 'TOGGLE_SETTINGS_VIEW':
            return { 
                ...state, 
                settingsView: !state.settingsView,
            }
        case 'SET_PLAYERS':
            return { 
                ...state, 
                players: action.data,
            }
        case 'SET_FROM_FILE':
            return { 
                ...state, 
                fromFile: action.data,
            }
        case 'SET_EXTRA_INFO':
            return { 
                ...state, 
                extraInfo: action.data,
            }
        case 'SET_NEW_PLAYERS':
            return { 
                ...state, 
                extraInfo: null,
                fromFile: action.data,
                players: action.data,
            }
        case 'SET_SETTINGS':
            return { 
                ...state, 
                settings: action.data,
            }
        case 'TOGGLE_ALL':
            localStorage.setItem('all', !state.all)
            return { 
                ...state, 
                all: !state.all,
            }
        case 'TOGGLE_TABLE':
            localStorage.setItem('table', !state.table)
            return { 
                ...state, 
                table: !state.table, 
            }
        case 'TOGGLE_EXTRA':
            return { 
                ...state, 
                openInfos: state.openInfos
                    .map((t, i) => i === action.data.teamIndex
                        ? t.map((p, j) => j === action.data.playerIndex
                            ? !p
                            : p
                        )
                        : t
                    )
            }
        case 'CLOSE_ALL_EXTRAS':
            return { 
                ...state, 
                openInfos: [
                    [false, false, false, false],
                    [false, false, false, false],
                ]
            }

        default:
            return state
    }
}

let store = createStore(reducer, { 
    settingsView: false,
    settings: null,

    players: null,
    fromFile: null, 
    extraInfo: null,

    all: localStorage.getItem('all') !== undefined 
        ? localStorage.getItem('all') 
        : false,
    table: localStorage.getItem('table') !== undefined 
        ? localStorage.getItem('table') 
        : false,
    
    openInfos: [
        [
            false,
            false,
            false,
            false,
        ],
        [
            false,
            false,
            false,
            false,
        ],
    ],

    countryFlags,
})

root.id = 'root'
document.body.appendChild(root)

render(
    <Provider store={store} >
        <App />
    </Provider>,
    document.getElementById('root')
)
