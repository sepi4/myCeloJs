const path = require('path')
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const fs = require('fs')
const http = require('http')

let mainWindow

function createMainWindow() {
    const icon =
        process.platform !== 'win32'
            ? path.join(__dirname, '../../img/icon/icon.png')
            : path.join(__dirname, '../../img/icon/icon.ico')

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false,
            preload: path.join(__dirname, '../preload/index.js'),
        },
        center: true,
    })

    if (process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    }

    mainWindow.setMenu(null)

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        if (process.env['ELECTRON_RENDERER_URL']) {
            const {
                installExtension,
                REACT_DEVELOPER_TOOLS,
            } = require('electron-devtools-installer')
            installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
                console.log('Error loading React DevTools:', err)
            )
            mainWindow.webContents.openDevTools()
        }
    })

    mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createMainWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createMainWindow()
})

// ── IPC handlers ──────────────────────────────────────────────────────────────

ipcMain.on('get-app-info', (event) => {
    event.returnValue = {
        version: app.getVersion(),
        settingsDir: app.getPath('userData'),
        appLocation: process.cwd(),
    }
})

ipcMain.handle('shell:open-external', (_event, url) => {
    return shell.openExternal(url)
})

ipcMain.handle('dialog:show-open', (_event, options) => {
    return dialog.showOpenDialog(mainWindow, options)
})

ipcMain.handle('settings:read', (_event, filePath) => {
    return fs.promises.readFile(filePath, 'utf-8').catch(() => null)
})

ipcMain.handle('settings:write', (_event, filePath, data) => {
    return fs.promises.writeFile(filePath, data, 'utf-8')
})

ipcMain.handle('log:read', (_event, filePath) => {
    return fs.promises.readFile(filePath, 'utf-8').catch(() => null)
})

ipcMain.handle('rankings:write', (_event, jsonContent, txtContent) => {
    const dir = path.join(process.cwd(), 'localhostFiles')
    return Promise.all([
        fs.promises
            .writeFile(path.join(dir, 'rankings.json'), jsonContent, 'utf-8')
            .catch((err) => console.log('Error writing rankings.json:', err)),
        fs.promises
            .writeFile(path.join(dir, 'rankings.txt'), txtContent, 'utf-8')
            .catch((err) => console.log('Error writing rankings.txt:', err)),
    ])
})

// ── Local HTTP server for streaming overlays ──────────────────────────────────

function serveJson(port) {
    http.createServer(function (_request, response) {
        response.writeHead(200, {
            'Content-Type': 'text/json',
            'Access-Control-Allow-Origin': '*',
            'X-Powered-By': 'nodejs',
        })
        fs.readFile(
            path.join(process.cwd(), 'localhostFiles', 'rankings.json'),
            function (_err, content) {
                response.write(content)
                response.end()
            }
        )
    }).listen(port, null, () => {})
}

const portfinder = require('portfinder')
portfinder
    .getPortPromise({ port: 2222, stopPort: 3333 })
    .then((port) => {
        console.log('portfinder free port:', port)
        serveJson(port.toString())
        fs.writeFile(
            path.join(process.cwd(), 'localhostFiles', 'port.js'),
            'let port = ' + port,
            'utf-8',
            (err) => {
                if (err) console.log('portfinder writing port.js error:', err)
            }
        )
    })
    .catch((err) => console.log('portfinder err:', err))
