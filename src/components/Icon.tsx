import { JSX } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'

type IconProps = {
    icon: IconProp
    fun: () => void
    size?: SizeProp
    testId?: string
}

export default function Icon({
    icon,
    fun,
    size = '2x',
    testId,
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
                color="#dddddd"
                style={{
                    marginRight: '0.2em',
                }}
            />
        </div>
    )
}
