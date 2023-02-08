import styles from './MainRowSpan.module.css'

interface Props {
    children: JSX.Element | null
    width: string
    justifyContent?: string
}

function MainRowSpan(props: Props) {
    return (
        <span
            className={styles.span}
            style={{
                width: props.width,
                justifyContent: props.justifyContent
                    ? props.justifyContent
                    : 'center',
            }}
        >
            {props.children}
        </span>
    )
}
export default MainRowSpan
