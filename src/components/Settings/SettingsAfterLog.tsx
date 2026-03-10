import { ChangeEvent } from 'react'

import getText from '../../functions/getText'
import writeSettings from '../../functions/writeSettings'
import { useAppLocationStore } from '../../stores/appLocationStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { SettingsType } from '../../types'
import CopyDiv from './CopyDiv'
import RadioButton from './RadioButton'
import RadioButtonsDiv from './RadioButtonsDiv'
import SettingsDiv from './SettingsDiv'
import SettingsLocation from './SettingsLocation'

export default function SettingsAfterLog() {
    const { settings } = useSettingsStore()
    const { appLocation } = useAppLocationStore()

    const handleType = (e: ChangeEvent<HTMLInputElement>) => {
        const newFormat = e.target.value
        const sep = window.electronAPI.pathSep
        const loc = appLocation + sep + 'localhostFiles' + sep + 'rankings.' + newFormat
        const newSettings = {
            ...settings,
            rankingsHtml: newFormat === 'html',
            rankingsFile: loc,
        } as SettingsType
        writeSettings(newSettings)
    }

    const handleOrientation = (e: ChangeEvent<HTMLInputElement>) => {
        const newOriantation = e.target.value
        const newSettings = {
            ...settings,
            rankingsHorizontal: newOriantation === 'horizontal',
        } as SettingsType
        writeSettings(newSettings)
    }

    const fileTypeSet = !!(
        settings &&
        settings.rankingsFile !== undefined &&
        settings.rankingsHorizontal !== undefined &&
        settings.rankingsHtml !== undefined
    )

    if (settings && (settings.logLocationCoh2 || settings.logLocationCoh3)) {
        return (
            <>
                <SettingsDiv title={getText('rankings_file_title', settings)}>
                    <RadioButtonsDiv title={getText('format', settings)}>
                        <RadioButton
                            checked={settings.rankingsHtml !== undefined && settings.rankingsHtml}
                            handler={handleType}
                            value={'html'}
                            labelText={'html'}
                            testId="radio-html"
                        />
                        <RadioButton
                            checked={settings.rankingsHtml !== undefined && !settings.rankingsHtml}
                            handler={handleType}
                            value={'txt'}
                            labelText={'txt'}
                        />
                    </RadioButtonsDiv>

                    <RadioButtonsDiv title={getText('orientation', settings)}>
                        <RadioButton
                            checked={
                                settings.rankingsHorizontal !== undefined &&
                                settings.rankingsHorizontal
                            }
                            handler={handleOrientation}
                            value={'horizontal'}
                            labelText={getText('horizontal', settings)}
                            testId="radio-horizontal"
                        />
                        <RadioButton
                            checked={
                                settings.rankingsHorizontal !== undefined &&
                                !settings.rankingsHorizontal
                            }
                            handler={handleOrientation}
                            value={'vertical'}
                            labelText={getText('vertical', settings)}
                        />
                    </RadioButtonsDiv>

                    <CopyDiv
                        testId="copy-rankings"
                        text={fileTypeSet ? settings.rankingsFile : undefined}
                    />
                </SettingsDiv>

                <SettingsLocation
                    fileTypeSet={fileTypeSet}
                    title={getText('settings_file_location_title', settings)}
                />
            </>
        )
    }

    // if log-file not set
    return (
        <SettingsDiv title={getText('settings_file_location_title', settings)}>
            <p style={{ color: 'darkred' }}>{getText('log_location_first', settings)}</p>
        </SettingsDiv>
    )
}
