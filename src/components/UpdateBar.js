import React from 'react'
import { useState } from 'react'

import axios from 'axios'

import e from 'electron'
const { clipboard, shell } = e.remote

function UpdateBar({ updateCheckNotDone, appVersion }) {
    const [update, setUpdate] = useState(null)

    const isHigherVersion = (tag, current)=> {
        let arrTag = tag.split('.')
        let arrCurrent = current.split('.')
        for (let i = 0; i < arrCurrent.length; i++) {
            if (arrTag[i] > arrCurrent[i]) {
                return true
            } else if (arrTag[i] < arrCurrent[i]) {
                return false
            }
        }
        return false
    }

    if (updateCheckNotDone) {
        updateCheckNotDone = false
        console.log('CHECKING UPDATE')

        let url = 'https://api.github.com/repos/sepi4/myCeloJs/releases/latest'
        axios.get(url)
            .then(x => {
                if (x && x.data) {
                    let newTagName = x.data.tag_name
                    if (isHigherVersion(newTagName, appVersion)) {
                        const data = x.data
                        if (data.assets[0]) {
                            setUpdate({
                                url: data.assets[0].browser_download_url,
                                tagName: newTagName,
                            })
                        }
                    }
                }
            })
    }

    const style = {
        height: '2em',
        width: '100%',
        backgroundColor: 'purple',
        position: 'fixed',
        bottom: 0,
        left: 0,
        color: '#ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '80%',
    }

    const buttonStyle={
        display: 'inline',
        backgroundColor: 'purple',
        border: '.1em solid #ddd',
        marginLeft: '1em',
        padding: '.1em .3em',
        color: '#ddd',
        cursor: 'pointer',
        fontSize: '1em',
    }

    return <div>
        {update
            ? <div style={style}>
                <span>update to version {update.tagName}</span>

                <button
                    style={buttonStyle}
                    onClick={() => {
                        shell.openExternal(update.url)
                    }}
                >download</button>

                <button
                    style={buttonStyle}
                    onClick={() => {
                        clipboard.writeText(update.url)
                    }}
                >copy link</button>
            </div>
            : null
        }
    </div>
}

export default UpdateBar