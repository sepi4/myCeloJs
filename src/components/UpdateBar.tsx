import React, { useEffect } from 'react'
import { useState } from 'react'

import writeSettings from '../functions/writeSettings'

import axios from 'axios'

import electron from 'electron'
import styles from './UpdateBar.module.css'

import funGetText from '../functions/getText'
import { useAppDispatch, useAppSelector } from '../hooks/customReduxHooks'
import { LATEST_RELEASES_URL } from '../constants'

const { clipboard, shell, app } = electron.remote

interface GitHubResult {
    data: {
        tag_name: string
        assets: {
            browser_download_url: string
        }[]
    }
}

interface A {
    url: string
    tagName: string
}

function UpdateBar() {
    const [update, setUpdate] = useState<A | null>(null)
    const dispatch = useAppDispatch()
    const updateCheckDone = useAppSelector((state) => state.updateCheckDone)
    const settings = useAppSelector((state) => state.settings)
    const appVersion = app.getVersion()

    const getText = function (x: string) {
        return funGetText(x, settings)
    }

    const isHigherVersion = (tag: string, current: string) => {
        const arrTag = tag.split('.')
        const arrCurrent = current.split('.')
        for (let i = 0; i < arrCurrent.length; i++) {
            if (Number(arrTag[i]) > Number(arrCurrent[i])) {
                return true
            } else if (Number(arrTag[i]) < Number(arrCurrent[i])) {
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

            const url = LATEST_RELEASES_URL
            axios.get(url).then((x: GitHubResult) => {
                if (x && x.data) {
                    const newTagName = x.data.tag_name
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

    const ignoreHandler = () => {
        const newSettings = {
            ...settings,
            ignoreUntil: update?.tagName,
        }
        setUpdate(null)
        writeSettings(newSettings, dispatch)
    }

    return (
        <>
            {update ? (
                <div className={styles.container}>
                    <span>
                        {getText('update_to_version')} {update.tagName}
                    </span>

                    <button
                        className={styles.btn}
                        onClick={() => {
                            shell.openExternal(update.url)
                        }}
                    >
                        {getText('download')}
                    </button>

                    <button
                        className={styles.btn}
                        onClick={() => {
                            clipboard.writeText(update.url)
                        }}
                    >
                        {getText('copy_link')}
                    </button>

                    <button className={styles.btn} onClick={ignoreHandler}>
                        {getText('skip_this_version')}
                    </button>
                </div>
            ) : null}
        </>
    )
}

export default UpdateBar
