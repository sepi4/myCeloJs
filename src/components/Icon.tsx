import { JSX } from 'react'

import { IconDefinition } from './icons'
import SvgIcon, { IconSize } from './SvgIcon'

type IconProps = {
    icon: IconDefinition
    fun: () => void
    size?: IconSize
    testId?: string
    color?: string
}

export default function Icon({
    icon,
    fun,
    size = '2x',
    testId,
    color = 'var(--text-primary)',
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
            <SvgIcon
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
