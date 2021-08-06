import React from 'react'
import electron from 'electron'
const { app } = electron.remote

import SettingsDiv from './SettingsDiv'
import CopyDiv from './CopyDiv'

export default function SettingsLocation({ fileTypeSet, title }) {
    if (fileTypeSet) {
        return <SettingsDiv title={title} >
            <CopyDiv
                text={app.getPath('userData') + '\\settings.json'}
            />
        </SettingsDiv>
    }

    return null
}