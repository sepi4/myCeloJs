import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

function ColumnTitle({children, width, click, style, active, reversed}) {
    const activeStyle = active
        ? {
            color: 'yellow',
            fontWeight: 'bold',
            cursor: 'pointer',
        }
        : null

    let caret = null
    if (active && reversed) {
        caret = <><FontAwesomeIcon icon={faCaretUp} /> </>
    } else if (active && !reversed) {
        caret = <><FontAwesomeIcon icon={faCaretDown} /> </>
    }

    return (
        <div
            style={{
                width: width || '20%',

                display: 'flex',
                justifyContent: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',

                ...activeStyle,
            }}
        >
            <span 
                onClick={click}
                style={{
                    ...style,
                    cursor: 'pointer',
                }}
            >{caret}{children}</span>
        </div>
    ) 
}

export default ColumnTitle