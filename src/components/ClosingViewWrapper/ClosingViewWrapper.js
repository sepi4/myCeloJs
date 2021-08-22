import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Icon from '../Icon'

import { faTimes, } from '@fortawesome/free-solid-svg-icons'

import styles from './ViewWrapper.module.css'

export default function ViewWrapper({ children }) {
    const dispatch = useDispatch()

    const handleToMainView = () => {
        dispatch({
            type: 'TO_MAIN_VIEW',
        })
    }

    // esc button close player card
    function escPressed(e) {
        if (e.key === 'Escape') {
            handleToMainView()
        }
    }
    useEffect(() => {
        window.addEventListener('keydown', escPressed);

        return () => {
            window.removeEventListener('keydown', escPressed);
        }
    })
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
