import React from 'react'
import { useSelector } from 'react-redux'

import e from 'electron'
const { shell } = e

import getSiteLink from '../../functions/getSiteLink'

function Members({ members }) {
    const state = useSelector(state => state)
    const countryFlags = state.countryFlags
    const settings = state.settings
    // const siteLink = settings ? settings.siteLink : 'coh2stats.com'

    const link = getSiteLink(settings.siteLink)
    // 'https://coh2stats.com/'
    // + 'players/'

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