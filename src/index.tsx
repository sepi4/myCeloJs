import React from 'react'
import { render } from 'react-dom'
import App from './App'

import { Provider } from 'react-redux'
import store from './store'

import './index.css'

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create
// our own root node in the body element before rendering into it

// let store = createStore(reducer, initialStore)

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
