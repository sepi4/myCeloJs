import React from 'react'
import { render } from 'react-dom'
import { createTheme, ThemeProvider } from '@mui/material'
import { grey, red } from '@mui/material/colors'

import App from './App'

import { Provider } from 'react-redux'
import store from './store'

import './index.css'

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create
// our own root node in the body element before rendering into it

// let store = createStore(reducer, initialStore)

const basicTextColor = '#808080'

const theme = createTheme({
    // palette: {
    //     primary: {
    //         main: purple[500],
    //     },
    //     secondary: {
    //         main: green[500],
    //     },
    // },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: grey[900],
                    padding: '1em',
                    marginBottom: '1em',
                    '&:hover': {
                        backgroundColor: red[900],
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    margin: 0,
                    padding: 0,
                    color: basicTextColor,
                },
            },
        },
    },
})

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
)
