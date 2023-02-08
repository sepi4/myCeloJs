import styles from './NavbarRow.module.css'

interface Props {
    children?: JSX.Element | JSX.Element[] | string
    fontSize?: string
}

export default function NavbarRow(props: Props) {
    return (
        <div
            className={styles.row}
            style={{
                fontSize: props.fontSize,
            }}
        >
            {props.children}
        </div>
    )
}
