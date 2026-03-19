import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import fs from 'fs'
import http from 'http'
import net from 'net'
import path from 'path'

import {
    renderRankingsBody,
    renderRankingsPage,
    renderRankingsTxtBody,
} from '../functions/rankings/renderRankingsHtml'
import { RankingsJson } from '../types'

const isDev = !!process.env['ELECTRON_RENDERER_URL']

/** Writable directory for rankings.txt (text overlay for OBS text source). */
const localhostDir = isDev
    ? path.join(process.cwd(), 'localhostFiles')
    : path.join(app.getPath('userData'), 'localhostFiles')

/** Directory containing faction icons and country flag images. */
const packagedImgDir = path.join(process.resourcesPath, 'img')
const imgDir = fs.existsSync(packagedImgDir)
    ? packagedImgDir
    : path.join(process.cwd(), 'src/assets/img')

fs.mkdirSync(localhostDir, { recursive: true })

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
    pushToClients('')
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

// ── Rankings state & SSE ─────────────────────────────────────────────────────

let overlayPort = 0
let currentHtmlBody = ''
let currentTxtBody = ''
let currentFormat: 'html' | 'txt' = 'html'
const sseClients = new Set<http.ServerResponse>()

function currentOverlayBody(): string {
    return currentFormat === 'html' ? currentHtmlBody : currentTxtBody
}

function pushToClients(body: string) {
    const data = `data: ${body.replace(/\n/g, '')}\n\n`
    for (const client of sseClients) {
        client.write(data)
    }
}

ipcMain.handle('rankings:write', async (_event, jsonContent: string, txtContent: string) => {
    const json: RankingsJson = JSON.parse(jsonContent)
    currentHtmlBody = renderRankingsBody(json)
    currentTxtBody = renderRankingsTxtBody(txtContent)
    pushToClients(currentOverlayBody())

    // Still write text and JSON files to disk as fallback
    await Promise.all([
        fs.promises
            .writeFile(path.join(localhostDir, 'rankings.json'), jsonContent, 'utf-8')
            .catch((err) => console.log('Error writing rankings.json:', err)),
        fs.promises
            .writeFile(path.join(localhostDir, 'rankings.txt'), txtContent, 'utf-8')
            .catch((err) => console.log('Error writing rankings.txt:', err)),
    ])
})

ipcMain.handle('rankings:set-format', (_event, format: 'html' | 'txt') => {
    currentFormat = format
    pushToClients(currentOverlayBody())
})

ipcMain.on('get-overlay-port', (event) => {
    event.returnValue = overlayPort
})

// ── Local HTTP server for OBS overlay ────────────────────────────────────────

const MIME_TYPES: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
}

function serveOverlay(port: number) {
    http.createServer((request, response) => {
        const url = request.url || '/'

        if (url === '/') {
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.end(renderRankingsPage())
            return
        }

        if (url === '/events') {
            response.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
                'Access-Control-Allow-Origin': '*',
            })
            // Send current state immediately so the overlay doesn't start blank
            const body = currentOverlayBody()
            if (body) {
                response.write(`data: ${body.replace(/\n/g, '')}\n\n`)
            }
            sseClients.add(response)
            request.on('close', () => sseClients.delete(response))
            return
        }

        // Serve images from /img/*
        if (url.startsWith('/img/')) {
            const relativePath = url.slice('/img/'.length)
            const filePath = path.join(imgDir, relativePath)
            const ext = path.extname(filePath)
            const mime = MIME_TYPES[ext] || 'application/octet-stream'

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    response.writeHead(404)
                    response.end()
                } else {
                    response.writeHead(200, { 'Content-Type': mime })
                    response.end(data)
                }
            })
            return
        }

        response.writeHead(404)
        response.end()
    }).listen(port)
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

async function startOverlayServer() {
    try {
        const foundPort = await findFreePort(2222, 3333)
        console.log('free port:', foundPort)
        overlayPort = foundPort
        serveOverlay(foundPort)
        // Write port file so e2e tests can discover the port
        await fs.promises.writeFile(
            path.join(localhostDir, 'port.js'),
            `let port = ${foundPort}`,
            'utf-8'
        )
    } catch (err) {
        console.log('overlay server err:', err)
    }
}
startOverlayServer()
