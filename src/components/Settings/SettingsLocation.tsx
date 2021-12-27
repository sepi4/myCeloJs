import React from 'react'
import electron from 'electron'
const { app } = electron.remote

import SettingsDiv from './SettingsDiv'
import CopyDiv from './CopyDiv'

interface Props {
    fileTypeSet: boolean
    title?: string
}

export default function SettingsLocation(props: Props) {
    if (props.fileTypeSet) {
        return (
            <SettingsDiv title={props.title}>
                <CopyDiv text={app.getPath('userData') + '\\settings.json'} />
            </SettingsDiv>
        )
    }

    return null
}
