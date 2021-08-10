import fs from 'fs'

export function readSettings(fileLocation, callback) {
    fileLocation = fileLocation.replace(/\\/, '\\\\')
    fs.readFile(fileLocation, 'utf-8', (err, data) => {
        if (err) {
            return
        }
        callback(data)
    })
}