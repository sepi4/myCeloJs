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
        case 'TOGGLE_LIST':
            return { 
                ...state, 
                tableView: !state.tableView, 
            }
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
        case 'TOGGLE_NAVSETTING':
            return { 
                ...state, 
                settings: {
                    ...state.settings,
                    navSettings: state.settings.navSettings 
                        .map(obj => obj.text === action.data.text
                            ? {
                                text: obj.text,
                                value: !obj.value
                            }
                            : obj
                        )
                    
                }
            }

        default:
            return state
    }
}

let store = createStore(reducer, { 
    tableView: false,
    settingsView: false,
    settings: null,

    players: null,
    fromFile: null, 
    extraInfo: null,

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
