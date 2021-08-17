import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Icon({ icon, fun, }) {
    return (
        <div
            style={{
                width: '100%',
                justifyContent: 'flex-end',
                display: 'flex',
            }}
        >
            <FontAwesomeIcon
                icon={icon}
                size='2x'
                color='#dddddd'
                onClick={fun}
                style={{
                    marginRight: '0.2em',
                    cursor: 'pointer',
                }}
            />
        </div>
    )
}
