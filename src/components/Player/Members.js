import React from 'react'
import { useSelector } from 'react-redux'

import e from 'electron'
const { shell } = e

function Members({ members }) {
    const countryFlags = useSelector(state => state.countryFlags)

    const link =
        'https://coh2stats.com/'
        + 'players/'

    return <div style={{ margin: '0.5rem 0' }}>
        <hr />
        {members.map(m => (
            <div
                style={{
                    marginLeft: '1em',
                    fontSize: '0.9em',
                    cursor: 'pointer',
                    color: 'green',
                }}
                key={m.name}
                onClick={() => shell.openExternal(link + m.name.substring(7))}
            >
                <img
                    style={{
                        width: '1em',
                        marginRight: '1em',
                    }}
                    src={countryFlags[m.country]}
                    alt={`${m.country}`}
                />

                {m.alias}
            </div>
        ))}
    </div>
}

export default Members