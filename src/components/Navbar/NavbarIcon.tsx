import { CSSProperties } from 'react'

import type { IconDefinition } from '../icons'
import SvgIcon from '../SvgIcon'

interface Props {
    icon: IconDefinition
    fun?: () => void
    title?: string
    style?: CSSProperties
    testId?: string
}

export default function NavBarIcon(props: Props) {
    return (
        <span data-testid={props.testId} title={props.title} style={{ display: 'inline-flex' }}>
            <SvgIcon
                title={props.title}
                icon={props.icon}
                size="xl"
                color="var(--text-secondary)"
                onClick={props.fun}
                style={{
                    cursor: 'pointer',
                    ...props.style,
                }}
            />
        </span>
    )
}
