import React from 'react'

import { StyledContentDiv, StyledDiv } from '../styled/styledSettings'

function SettingsDiv({ title, required, children }) {
    const req = required
        ? <span
            style={{
                // marginLeft: '1em',
                color: 'darkred',
                fontWeight: 'bold',
                fontSize: '150%',
            }}
        >
            *
        </span>
        : null
    return <StyledDiv>
        {title && (
            <div
                style={{
                    fontWeight: 'bold',
                    fontSize: '100%',
                }}
            >
                {title} {req}
            </div>
        )}
        <StyledContentDiv>{children}</StyledContentDiv>
    </StyledDiv>

}

export default SettingsDiv
