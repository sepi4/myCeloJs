import React from 'react'
import electron from 'electron'
const { app } = electron.remote

import SettingsDiv from './SettingsDiv'
import CopyDiv from './CopyDiv'

export default function SettingsLocation({ fileTypeSet }) {
    if (fileTypeSet) {
        return <SettingsDiv title='Settings file location:' >
            <CopyDiv
                text={app.getPath('userData') + '\\settings.json'}
            />
        </SettingsDiv>
    }

    return null
}