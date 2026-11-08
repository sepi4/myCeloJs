import styles from './Choice.module.css'

interface Props {
    type: 'checkbox' | 'radio'
    label?: string
    checked: boolean
    onChange: () => void
    name?: string
    value?: string
    disabled?: boolean
    title?: string
    testId?: string
    className?: string
}

export default function Choice(props: Props) {
    return (
        <label
            className={props.className ? `${styles.choice} ${props.className}` : styles.choice}
            title={props.title}
        >
            <input
                data-testid={props.testId}
                type={props.type}
                name={props.name}
                value={props.value}
                checked={props.checked}
                disabled={props.disabled}
                onChange={props.onChange}
            />
            {props.label}
        </label>
    )
}
