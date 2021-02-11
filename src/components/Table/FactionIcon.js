import React from 'react'

import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'

function FactionIcon({faction, size}) {
    return <div
        style={{
            display: 'grid',
            placeItems: 'center',
        }}
    >
        <img
            style={{
                width: size,
                height: size,
            }}
            src={getFactionFlagLocation(faction)}
            alt={`${faction}`}
        />
    </div>
}

export default FactionIcon