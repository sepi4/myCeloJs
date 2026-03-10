import { useEffect, useState } from 'react'

import { LATEST_RELEASES_URL } from '../constants'
import funGetText from '../functions/getText'
import writeSettings from '../functions/writeSettings'
import { useSettingsStore } from '../stores/settingsStore'
import { useUpdateCheckDoneStore } from '../stores/updateCheckDoneStore'
import { SettingsType } from '../types'
import styles from './UpdateBar.module.css'

interface GitHubResult {
    tag_name: string
    assets: {
        browser_download_url: string
    }[]
}

interface A {
    url: string
    tagName: string
}

export const isHigherVersion = (tag: string, current: string) => {
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

const appVersion = window.electronAPI.appVersion

function UpdateBar() {
    const [update, setUpdate] = useState<A | null>(null)
    const { updateCheckDone, setUpdateCheckDone } = useUpdateCheckDoneStore()
    const { settings } = useSettingsStore()

    const getText = function (x: string) {
        return funGetText(x, settings)
    }

    useEffect(() => {
        if (!updateCheckDone && settings) {
            console.log('CHECKING UPDATE')
            setUpdateCheckDone()

            const url = LATEST_RELEASES_URL
            fetch(url)
                .then((res) => res.json())
                .then((data: GitHubResult) => {
                    if (data) {
                        const newTagName = data.tag_name
                        if (settings.ignoreUntil === newTagName) {
                            return
                        }
                        if (isHigherVersion(newTagName, appVersion)) {
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
    }, [updateCheckDone, settings, setUpdateCheckDone])

    const ignoreHandler = () => {
        const newSettings = {
            ...settings,
            ignoreUntil: update?.tagName,
        } as SettingsType
        setUpdate(null)
        writeSettings(newSettings)
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
                            window.electronAPI.shell.openExternal(update.url)
                        }}
                    >
                        {getText('download')}
                    </button>

                    <button
                        className={styles.btn}
                        onClick={() => {
                            navigator.clipboard.writeText(update.url)
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
