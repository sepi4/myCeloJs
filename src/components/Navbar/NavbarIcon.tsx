import { CSSProperties } from 'react'

import type { IconDefinition } from '../icons'
import SvgIcon from '../SvgIcon'

interface Props {
    icon: IconDefinition
    onClick?: () => void
    title?: string
    style?: CSSProperties
    testId?: string
    disabled?: boolean
}

export default function NavBarIcon(props: Props) {
    return (
        <span
            data-testid={props.testId}
            title={props.title}
            aria-disabled={props.disabled || undefined}
            style={{ display: 'inline-flex' }}
        >
            <SvgIcon
                title={props.title}
                icon={props.icon}
                size="xl"
                color="var(--text-secondary)"
                onClick={props.onClick}
                style={{
                    cursor: props.disabled ? 'default' : 'pointer',
                    opacity: props.disabled ? 0.35 : undefined,
                    ...props.style,
                }}
            />
        </span>
    )
}
