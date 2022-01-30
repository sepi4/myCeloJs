import React, { CSSProperties } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-common-types'

interface Props {
    icon: IconDefinition
    fun?: () => void
    title?: string
    style?: CSSProperties
}

export default function NavBarIcon(props: Props) {
    return (
        <FontAwesomeIcon
            title={props.title}
            icon={props.icon}
            size="2x"
            color="gray"
            onClick={props.fun}
            style={{
                cursor: 'pointer',
                ...props.style,
            }}
        />
    )
}
