import Choice from '../Choice'

import styles from './RadioGroup.module.css'

interface Props<T extends string> {
    title: string
    titleTestId?: string
    name: string
    testIdPrefix: string
    options: readonly T[]
    selected: T | undefined
    getLabel: (option: T) => string
    onChange: (option: T) => void
    optionsClassName?: string
    /** Small title with the options in one row. */
    compact?: boolean
}

function RadioGroup<T extends string>(props: Props<T>) {
    return (
        <div>
            <div
                className={props.compact ? styles.compactTitle : styles.title}
                data-testid={props.titleTestId}
            >
                {props.title}
            </div>
            <div
                className={
                    props.optionsClassName ??
                    (props.compact ? styles.compactOptions : styles.options)
                }
            >
                {props.options.map((option) => (
                    <Choice
                        key={option}
                        type="radio"
                        testId={`${props.testIdPrefix}-${option}`}
                        name={props.name}
                        value={option}
                        label={props.getLabel(option)}
                        checked={props.selected === option}
                        onChange={() => props.onChange(option)}
                    />
                ))}
            </div>
        </div>
    )
}

export default RadioGroup
