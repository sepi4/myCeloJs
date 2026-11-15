import Choice from '../Choice'

import styles from './RadioGroup.module.css'

interface Option {
    label: string
    checked: boolean
    onChange: () => void
    testId: string
    disabled?: boolean
    title?: string
}

interface Props {
    title: string
    options: Option[]
}

/** Small title with the checkboxes in one row, like a compact RadioGroup. */
function CheckboxGroup(props: Props) {
    return (
        <div>
            <div className={styles.compactTitle}>{props.title}</div>
            <div className={styles.compactOptions}>
                {props.options.map((option) => (
                    <Choice
                        key={option.testId}
                        type="checkbox"
                        testId={option.testId}
                        label={option.label}
                        checked={option.checked}
                        onChange={option.onChange}
                        disabled={option.disabled}
                        title={option.title}
                    />
                ))}
            </div>
        </div>
    )
}

export default CheckboxGroup
