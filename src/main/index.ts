import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import fs from 'fs'
import http from 'http'
import net from 'net'
import path from 'path'

const isDev = !!process.env['ELECTRON_RENDERER_URL']

/**
 * Writable directory for OBS overlay files (rankings.html, rankings.json, port.js, etc.).
 *
 * - **Dev**: uses `<project>/localhostFiles/` which is directly writable.
 * - **Production** (AppImage/deb/exe): `extraResources` are read-only, so we use
 *   `app.getPath('userData')` (~/.config/myCelo on Linux) as a writable location.
 */
const localhostDir = isDev
    ? path.join(process.cwd(), 'localhostFiles')
    : path.join(app.getPath('userData'), 'localhostFiles')

/**
 * Copies static OBS overlay files (html, css, js) from the read-only extraResources
 * into the writable {@link localhostDir}, so that dynamic files (rankings.json, port.js)
 * can be written alongside them.
 */
function initLocalhostDir() {
    if (isDev) {
        return
    }
    fs.mkdirSync(localhostDir, { recursive: true })
    const sourceDir = path.join(process.resourcesPath, 'localhostFiles')
    for (const file of ['rankings.html', 'rankings.css', 'rankings.js']) {
        const src = path.join(sourceDir, file)
        const dest = path.join(localhostDir, file)
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest)
        }
    }
}
initLocalhostDir()

let mainWindow: BrowserWindow | null = null

function createMainWindow() {
    const icon =
        process.platform !== 'win32'
            ? path.join(__dirname, '../../assets/icon/icon.png')
            : path.join(__dirname, '../../assets/icon/icon.ico')

    mainWindow = new BrowserWindow({
        width: isDev ? 1100 : 800,
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
        mainWindow!.show()
        if (process.env['ELECTRON_RENDERER_URL']) {
            mainWindow!.webContents.openDevTools()
        }
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

// ── IPC handlers ──────────────────────────────────────────────────────────────

ipcMain.on('get-app-info', (event) => {
    event.returnValue = {
        version: app.getVersion(),
        settingsDir: app.getPath('userData'),
        appLocation: path.dirname(localhostDir),
        pathSep: path.sep,
    }
})

ipcMain.handle('shell:open-external', (_event, url: string) => {
    return shell.openExternal(url)
})

ipcMain.handle('dialog:show-open', (_event, options) => {
    return dialog.showOpenDialog(mainWindow!, options)
})

ipcMain.handle('settings:read', async (_event, filePath: string) => {
    try {
        return await fs.promises.readFile(filePath, 'utf-8')
    } catch {
        return null
    }
})

ipcMain.handle('settings:write', async (_event, filePath: string, data: string) => {
    await fs.promises.writeFile(filePath, data, 'utf-8')
})

ipcMain.handle('log:read', async (_event, filePath: string) => {
    try {
        return await fs.promises.readFile(filePath, 'utf-8')
    } catch {
        return null
    }
})

ipcMain.handle('rankings:write', async (_event, jsonContent: string, txtContent: string) => {
    const dir = localhostDir
    await Promise.all([
        fs.promises
            .writeFile(path.join(dir, 'rankings.json'), jsonContent, 'utf-8')
            .catch((err) => console.log('Error writing rankings.json:', err)),
        fs.promises
            .writeFile(path.join(dir, 'rankings.txt'), txtContent, 'utf-8')
            .catch((err) => console.log('Error writing rankings.txt:', err)),
    ])
})

// ── Local HTTP server for streaming overlays ──────────────────────────────────

function serveJson(port: string) {
    http.createServer(function (_request, response) {
        response.writeHead(200, {
            'Content-Type': 'text/json',
            'Access-Control-Allow-Origin': '*',
            'X-Powered-By': 'nodejs',
        })
        fs.readFile(path.join(localhostDir, 'rankings.json'), function (err, content) {
            if (err || !content) {
                response.write('{}')
            } else {
                response.write(content)
            }
            response.end()
        })
    }).listen(port, undefined, () => {})
}

function findFreePort(start: number, stop: number): Promise<number> {
    return new Promise((resolve, reject) => {
        const server = net.createServer()
        server.listen(start, () => {
            const port = (server.address() as net.AddressInfo).port
            server.close(() => resolve(port))
        })
        server.on('error', () => {
            if (start >= stop) {
                reject(new Error('No free port found'))
            } else {
                findFreePort(start + 1, stop).then(resolve, reject)
            }
        })
    })
}

async function startPortServer() {
    try {
        const port = await findFreePort(2222, 3333)
        console.log('free port:', port)
        serveJson(port.toString())
        await fs.promises.writeFile(
            path.join(localhostDir, 'port.js'),
            'let port = ' + port,
            'utf-8'
        )
    } catch (err) {
        console.log('port server err:', err)
    }
}
startPortServer()
