import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { JSX } from 'react'

type IconProps = {
    icon: IconProp
    fun: () => void
    size?: SizeProp
    testId?: string
    color?: string
}

export default function Icon({
    icon,
    fun,
    size = '2x',
    testId,
    color = '#dddddd',
}: IconProps): JSX.Element {
    return (
        <div
            data-testid={testId}
            onClick={fun}
            style={{
                width: '100%',
                justifyContent: 'flex-end',
                display: 'flex',
                cursor: 'pointer',
            }}
        >
            <FontAwesomeIcon
                icon={icon}
                size={size}
                color={color}
                style={{
                    marginRight: '0.2em',
                }}
            />
        </div>
    )
}
