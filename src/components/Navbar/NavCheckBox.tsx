import moduleStyle from './NavCheckBox.module.css'

interface Props {
    text?: string
    handler: () => void
    checked: boolean
}

export default function NavCheckbox(props: Props) {
    const id = Math.random().toString()

    return (
        <span className={moduleStyle.span}>
            <input
                className={moduleStyle.input}
                onChange={props.handler}
                defaultChecked={props.checked}
                id={id}
                type="checkbox"
            />

            <label className={moduleStyle.label} htmlFor={id}>
                {props.text}
            </label>
        </span>
    )
}
