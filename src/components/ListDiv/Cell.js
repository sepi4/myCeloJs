import React from 'react'

function Cell({ children, title, color, width, cursor }) {
    return (
        <div
            style={{
                color,
                width: width || '20%',
                cursor: cursor || 'default',

                display: 'flex',
                justifyContent: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            }}
        >
            <span title={title} >
                {children}
            </span>
        </div>
    )
}

export default Cell