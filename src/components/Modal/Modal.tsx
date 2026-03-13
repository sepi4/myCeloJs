import { JSX } from 'react'

import useEsc from '../../hooks/useEsc'

interface Props {
    isOpen: boolean
    onClose: () => void
    children: JSX.Element | JSX.Element[]
    className?: string
    overlayClassName?: string
    'data-testid'?: string
}

function Modal(props: Props) {
    useEsc(props.isOpen ? props.onClose : () => {})

    if (!props.isOpen) {return null}

    return (
        <div className={props.overlayClassName} onClick={props.onClose}>
            <div
                className={props.className}
                data-testid={props['data-testid']}
                onClick={(e) => e.stopPropagation()}
            >
                {props.children}
            </div>
        </div>
    )
}

export default Modal
