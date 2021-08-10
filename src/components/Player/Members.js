import React from 'react'
import { useSelector } from 'react-redux'
import styles from './Members.module.css'

import e from 'electron'
const { shell } = e

import getSiteLink from '../../functions/getSiteLink'

function Members({ members }) {
    const state = useSelector(state => state)
    const countryFlags = state.countryFlags
    const settings = state.settings

    const link = getSiteLink(settings.siteLink)

    return <div style={{ margin: '0.5rem 0' }}>
        <hr />
        {members.map(m => (
            <div
                className={styles.membersDiv}
                key={m.name}
                onClick={() => shell.openExternal(link + m.name.substring(7))}
            >
                <img
                    className={styles.flagImage}
                    src={countryFlags[m.country]}
                    alt={`${m.country}`}
                />

                {m.alias}
            </div>
        ))}
    </div>
}

export default Members