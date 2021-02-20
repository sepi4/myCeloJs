import React from 'react'

import { StyledContentDiv, StyledDiv} from '../styled/styledSettings'

function SettingsDiv({ title, children }) {
    return <StyledDiv>
        {title && 
            <div style={{ 
                fontWeight: 'bold',
                fontSize: '120%',
            }} >{title}</div>
        }
        <StyledContentDiv>{children}</StyledContentDiv>
    </StyledDiv>
}

export default SettingsDiv