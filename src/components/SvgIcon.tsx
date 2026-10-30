import { SVGProps } from 'react'

import { IconDefinition } from './icons'

import styles from './SvgIcon.module.css'

export type IconSize = 'sm' | 'lg' | 'xl' | '2x'

const sizeClasses: Record<IconSize, string> = {
    sm: styles.sm,
    lg: styles.lg,
    xl: styles.xl,
    '2x': styles.x2,
}

type Props = Omit<SVGProps<SVGSVGElement>, 'children'> & {
    icon: IconDefinition
    size?: IconSize
    title?: string
}

export default function SvgIcon({ icon, size, title, color, style, className, ...rest }: Props) {
    const classes = [styles.icon, size && sizeClasses[size], className].filter(Boolean).join(' ')
    return (
        <svg
            {...rest}
            className={classes}
            viewBox={`0 0 ${icon.width} 512`}
            fill="currentColor"
            role="img"
            aria-hidden={title ? undefined : true}
            style={color ? { color, ...style } : style}
        >
            {title && <title>{title}</title>}
            <path d={icon.path} />
        </svg>
    )
}
