import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import writeSettings from '../functions/writeSettings'

import axios from 'axios'

import electron from 'electron'
import styles from './UpdateBar.module.css'

import _getText from '../functions/getText'

const { clipboard, shell, app } = electron.remote

function UpdateBar() {
    const [update, setUpdate] = useState(null)
    const dispatch = useDispatch()
    const updateCheckDone = useSelector(state => state.updateCheckDone)
    const settings = useSelector(state => state.settings)
    const appVersion = app.getVersion()

    const getText = function (x) {
        return _getText(x, settings)
    }

    const isHigherVersion = (tag, current) => {
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

    useEffect(() => {
        if (!updateCheckDone && settings) {
            console.log('CHECKING UPDATE')
            dispatch({
                type: 'UPDATE_CHECK_DONE',
            })


            let url = 'https://api.github.com/repos/sepi4/myCeloJs/releases/latest'
            axios.get(url)
                .then(x => {
                    if (x && x.data) {
                        let newTagName = x.data.tag_name
                        if (settings.ignoreUntil === newTagName) {
                            return
                        }
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

    }, [])


    const ignore = () => {
        const newSettings = {
            ...settings,
            ignoreUntil: update.tagName
        }
        setUpdate(null)
        writeSettings(newSettings, dispatch)
    }

    return <>
        {update
            ? <div className={styles.container}>
                <span>{getText('update_to_version')} {update.tagName}</span>

                <button
                    className={styles.btn}
                    onClick={() => {
                        shell.openExternal(update.url)
                    }}
                >{getText('download')}</button>

                <button
                    className={styles.btn}
                    onClick={() => {
                        clipboard.writeText(update.url)
                    }}
                >{getText('copy_link')}</button>

                <button
                    className={styles.btn}
                    onClick={ignore}
                >{getText('skip_this_version')}</button>
            </div>
            : null
        }
    </>
}

export default UpdateBar