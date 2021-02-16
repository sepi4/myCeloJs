import React from 'react'
import { render } from 'react-dom'
import App from './App'
import './index.css'

import { copyObj } from './functions/simpleFunctions'

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
    countryFlags[x.default.substring(4,6)] = x.default
})

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create 
// our own root node in the body element before rendering into it
let root = document.createElement('div')

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
                extraInfo: action.data.extraInfo,
                players: action.data.newPlayers,
            }
        case 'CLEAR_EXTRA_INFO':
            return { 
                ...state, 
                extraInfo: null,
            }

        case 'SET_NEW_PLAYERS':
            return { 
                ...state, 
                extraInfo: null,
                fromFile: action.data,
                players: action.data,
                openInfos: [
                    [false, false, false, false],
                    [false, false, false, false],
                ],
            }
        case 'SET_SETTINGS':
            return { 
                ...state, 
                settings: action.data,
            }

        case 'TOGGLE_NAVBUTTON':
            // eslint-disable-next-line no-case-declarations
            let obj = copyObj(state.navButtons)
            obj[action.key] = !obj[action.key]
            localStorage.setItem(
                'navButtons', 
                JSON.stringify(obj),
            )
            return { 
                ...state, 
                navButtons: obj,
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

        case 'SET_SORTER':
            return {
                ...state,
                sorter: state.sorter.name === action.data.name
                    ? {
                        fun: action.data.fun,
                        name: action.data.name,
                        reversed: !state.sorter.reversed,
                    }
                    : {
                        fun: action.data.fun,
                        name: action.data.name,
                        reversed: false,
                    }, 
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

    navButtons: function(){
        const str = localStorage.getItem('navButtons')
        if (str) {
            return JSON.parse(str)
        }
        return {
            all: false,
            table: false,
        }
    }(),
    
    openInfos: [
        [ false, false, false, false, ],
        [ false, false, false, false, ],
    ],

    countryFlags,

    sorter: {
        fun: (a, b) => a.rank - b.rank,
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
