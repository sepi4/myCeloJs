import { render } from 'react-dom'
import App from './App'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import './index.css'

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create
// our own root node in the body element before rendering into it

import reducer from './reducer'
import initialStore from './initialStore'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer,
    devTools: true,
    preloadedState: initialStore,
})

// let store = createStore(reducer, initialStore)

let root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
