import { useEffect, useState } from 'react'

import writeSettings from '../functions/settings/writeSettings'
import funGetText from '../functions/utils/getText'
import { useSettingsStore } from '../stores/settingsStore'
import { SettingsType } from '../types'
import styles from './UpdateBar.module.css'

type UpdateState =
    | { step: 'available'; version: string }
    | { step: 'downloading' }
    | { step: 'downloaded'; version: string }
    | { step: 'error' }

function UpdateBar() {
    const [update, setUpdate] = useState<UpdateState | null>(null)
    const { settings } = useSettingsStore()

    const getText = (x: string) => funGetText(x, settings)

    useEffect(() => {
        window.electronAPI.updater.onStatus((status) => {
            if (status.status === 'available' && status.version) {
                if (settings?.ignoreUntil === status.version) {
                    return
                }
                setUpdate({ step: 'available', version: status.version })
            } else if (status.status === 'downloaded' && status.version) {
                setUpdate({ step: 'downloaded', version: status.version })
            } else if (status.status === 'error') {
                setUpdate({ step: 'error' })
            }
        })
    }, [settings?.ignoreUntil])

    if (!update) {
        return null
    }

    const ignoreHandler = () => {
        if (update.step === 'available') {
            const newSettings = {
                ...settings,
                ignoreUntil: update.version,
            } as SettingsType
            setUpdate(null)
            writeSettings(newSettings)
        }
    }

    const downloadHandler = () => {
        setUpdate({ step: 'downloading' })
        window.electronAPI.updater.download()
    }

    return (
        <div className={styles.container}>
            {update.step === 'available' && (
                <>
                    <span>
                        {getText('update_to_version')} {update.version}
                    </span>
                    <button className={styles.btn} onClick={downloadHandler}>
                        {getText('download')}
                    </button>
                    <button className={styles.btn} onClick={ignoreHandler}>
                        {getText('skip_this_version')}
                    </button>
                </>
            )}

            {update.step === 'downloading' && <span>{getText('update_downloading')}</span>}

            {update.step === 'error' && <span>{getText('update_error')}</span>}

            {update.step === 'downloaded' && (
                <>
                    <span>
                        {getText('update_to_version')} {update.version}
                    </span>
                    <button
                        className={styles.btn}
                        onClick={() => window.electronAPI.updater.install()}
                    >
                        {getText('update_restart')}
                    </button>
                </>
            )}
        </div>
    )
}

export default UpdateBar
