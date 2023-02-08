import Icon from '../Icon'

import { faTimes } from '@fortawesome/free-solid-svg-icons'

import styles from './ViewWrapper.module.css'
import useEsc from '../../hooks/useEsc'
import { useAppDispatch } from '../../hooks/customReduxHooks'

interface Props {
    children: JSX.Element | JSX.Element[]
}

export default function ViewWrapper(props: Props) {
    const dispatch = useAppDispatch()

    const handleToMainView = () => {
        dispatch({
            type: 'TO_MAIN_VIEW',
        })
    }

    useEsc(handleToMainView)

    return (
        <div className={styles.container}>
            <Icon fun={handleToMainView} icon={faTimes} />
            {props.children}
        </div>
    )
}
