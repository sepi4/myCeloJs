import React from 'react'
import { useDispatch } from 'react-redux'

import Icon from '../Icon'

import { faTimes, } from '@fortawesome/free-solid-svg-icons'

import styles from './ViewWrapper.module.css'
import useEsc from '../../hooks/useEsc'

export default function ViewWrapper({ children }) {
    const dispatch = useDispatch()

    const handleToMainView = () => {
        dispatch({
            type: 'TO_MAIN_VIEW',
        })
    }

    useEsc(handleToMainView)

    return (
        <div className={styles.container}>
            <Icon
                fun={handleToMainView}
                icon={faTimes}
            />
            {children}
        </div>

    )
}
