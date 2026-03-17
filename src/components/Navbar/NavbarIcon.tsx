import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CSSProperties } from 'react'

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
            <FontAwesomeIcon
                title={props.title}
                icon={props.icon}
                size="xl"
                color="gray"
                onClick={props.fun}
                style={{
                    cursor: 'pointer',
                    ...props.style,
                }}
            />
        </span>
    )
}
