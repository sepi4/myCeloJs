import React from 'react'

function Cell({children, title, color, width, cursor}) {
    return (
        <div
            title={title}
            style={{
                color,
                width: width || '20%',
                cursor: cursor ||'default',

                display: 'flex',
                justifyContent: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            }}
        >
            {children}
        </div>
    ) 
}

export default Cell