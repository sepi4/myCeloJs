import React from 'react'

interface Props {
    children?: string | number | JSX.Element
    title?: string
    color?: string
    width?: string
    cursor?: string
    justifyContent?: string
}

function Cell(props: Props) {
    return (
        <div
            style={{
                color: props.color,
                width: props.width ?? '20%',
                cursor: props.cursor ?? 'default',

                display: 'flex',
                justifyContent: props.justifyContent ?? 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            }}
        >
            <span title={props.title}>{props.children}</span>
        </div>
    )
}

export default Cell
