import React from 'react'
import { useSelector } from 'react-redux'

import e from 'electron'
const { shell } = e

function Members({ members }) {
    const countryFlags = useSelector(state => state.countryFlags)

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
                onClick={() =>
                    shell.openExternal(
                        'https://www.coh2.org/'
                        + 'ladders/playercard/steamid/'
                        + m.name.substring(7)

                        // 'http://www.companyofheroes.com/' +
                        // 'leaderboards#profile/steam/' +
                        // m.name.substring(7) +
                        // '/standings',
                    )
                }
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