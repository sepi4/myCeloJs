import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NavBarIcon({ icon, fun, title, style }) {
    return <FontAwesomeIcon
        title={title}
        icon={icon}
        size='2x'
        color='gray'
        onClick={fun}
        style={{
            marginRight: '0.5em',
            marginLeft: '0.5em',
            cursor: 'pointer',
            ...style,
        }}
    />
}
