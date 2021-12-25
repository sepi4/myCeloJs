import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'

type IconProps = {
    icon: IconProp
    fun: () => void
    size: SizeProp
}

export default function Icon({
    icon,
    fun,
    size = '2x',
}: IconProps): JSX.Element {
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
                size={size}
                color="#dddddd"
                onClick={fun}
                style={{
                    marginRight: '0.2em',
                    cursor: 'pointer',
                }}
            />
        </div>
    )
}
