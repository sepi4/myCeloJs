import { JSX } from 'react'

import getText from '../../functions/getText'
import { useSettingsStore } from '../../stores/settingsStore'
import { StyledContentDiv, StyledDiv } from '../styled/styledSettings'

interface Props {
    title?: string
    required?: boolean
    requiredTitle?: string
    children?: JSX.Element | JSX.Element[]
    testId?: string
}

function SettingsDiv(props: Props) {
    const { settings } = useSettingsStore()
    const req = props.required ? (
        <span
            title={props.requiredTitle ?? getText('required', settings)}
            style={{
                color: 'darkred',
                fontWeight: 'bold',
                fontSize: '150%',
            }}
        >
            *
        </span>
    ) : null
    return (
        <StyledDiv>
            {props.title && (
                <div
                    data-testid={props.testId}
                    style={{
                        fontWeight: 'bold',
                        fontSize: '100%',
                    }}
                >
                    {props.title} {req}
                </div>
            )}
            <StyledContentDiv>{props.children}</StyledContentDiv>
        </StyledDiv>
    )
}

export default SettingsDiv
