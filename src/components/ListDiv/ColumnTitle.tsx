import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import styles from './ColumnTitle.module.css'

interface Props {
    children: string | undefined
    width?: string
    click: () => void
    active: boolean
    reversed: boolean
}

function ColumnTitle(props: Props) {
    const { children, width, click, active, reversed } = props

    let caret = null
    if (active && reversed) {
        caret = (
            <>
                <FontAwesomeIcon icon={faCaretUp} />{' '}
            </>
        )
    } else if (active && !reversed) {
        caret = (
            <>
                <FontAwesomeIcon icon={faCaretDown} />{' '}
            </>
        )
    }

    return (
        <div
            style={{ width: width || '20%' }}
            className={`${styles.def} ${active ? styles.active : ''}`}
        >
            <span onClick={click} style={{ cursor: 'pointer' }}>
                {caret}
                {children}
            </span>
        </div>
    )
}

export default ColumnTitle
