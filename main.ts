/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const url = require('url')
const { app, BrowserWindow } = require('electron')

let mainWindow

let isDev = false

if (
    process.env.NODE_ENV !== undefined &&
    process.env.NODE_ENV === 'development'
) {
    isDev = true
}

function createMainWindow() {
    let icon
    if (process.platform !== 'win32') {
        icon = `${__dirname}/img/icon/icon.png`
    } else {
        icon = `${__dirname}/img/icon/icon.ico`
    }

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon: icon,
        webPreferences: {
            nodeIntegration: true,
            nativeWindowOpen: true,
            webSecurity: false,
        },
        center: true,
        // enableRemoteModule: true,
    })

    let indexPath

    if (isDev && process.argv.indexOf('--noDevServer') === -1) {
        indexPath = url.format({
            protocol: 'http:',
            host: 'localhost:8080',
            pathname: 'index.html',
            slashes: true,
        })
    } else {
        indexPath = url.format({
            protocol: 'file:',
            pathname: path.join(__dirname, 'dist', 'index.html'),
            slashes: true,
        })
    }

    mainWindow.loadURL(indexPath)
    mainWindow.setMenu(null)

    // Don't show until we are ready and loaded
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()

        // Open devtools if dev
        if (isDev) {
            const {
                default: installExtension,
                REACT_DEVELOPER_TOOLS,
            } = require('electron-devtools-installer')

            installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
                console.log('Error loading React DevTools: ', err)
            )
            mainWindow.webContents.openDevTools()
        }
        // mainWindow.webContents.openDevTools()
    })

    mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createMainWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow()
    }
})

// Stop error
app.allowRendererProcessReuse = true

const http = require('http')
const fs = require('fs')

function serveJson(port) {
    http.createServer(function (request, response) {
        response.writeHead(200, {
            'Content-Type': 'text/json',
            'Access-Control-Allow-Origin': '*',
            'X-Powered-By': 'nodejs',
        })
        fs.readFile('./localhostFiles/rankings.json', function (err, content) {
            response.write(content)
            response.end()
        })
    }).listen(port, null, () => {
        // console.log('after listen')
    })
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const portfinder = require('portfinder')

portfinder
    .getPortPromise({
        port: 2222,
        stopPort: 3333,
    })
    .then((port) => {
        console.log('portfinder free port:', port)
        serveJson(port.toString())
        fs.writeFile(
            './localhostFiles/port.js',
            'let port = ' + port,
            'utf-8',
            (err) => {
                if (err) {
                    console.log('portfinder writing port.js file error:', err)
                }
            }
        )
    })
    .catch((err) => {
        console.log('portfinder err:', err)
    })
