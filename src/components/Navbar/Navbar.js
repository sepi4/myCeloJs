import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Navbar.module.css'

import { faCogs, faSearch, faTimes, faUserAlt } from '@fortawesome/free-solid-svg-icons'

import getText from '../../functions/getText'

import NavCheckbox from './NavCheckBox'

import NavBarIcon from './NavbarIcon'
import CheckLogDiv from './CheckLogDiv'
import NavbarRow from './NavbarRow'
import { getExtraInfo } from '../../functions/getExtraInfo'

export default function Navbar({ handleSetSettingsView }) {
    const state = useSelector(state => state)
    const settings = state.settings
    const dispatch = useDispatch()

    const settingsViewToggeler = () => {
        dispatch({ type: 'TOGGLE_SETTINGS_VIEW' })
        handleSetSettingsView()
    }

    const navButtons = useSelector(state => state.navButtons)

    const [all, table, total] = ['all', 'table', 'total'].map(text => {
        return <NavCheckbox
            key={text}
            text={getText(text, settings)}
            checked={navButtons[text]}
            handler={() => dispatch({
                type: 'TOGGLE_NAVBUTTON',
                key: text,
            })}
        />
    })

    if (state.settingsView) {
        return <div
            className={styles.navbar}
            style={{ justifyContent: 'flex-end' }}
        >
            <NavBarIcon icon={faTimes} fun={settingsViewToggeler} />
        </div>
    }

    const handleSearchView = () => {
        dispatch({
            type: 'SEARCH_VIEW_ON',
        })
    }

    const handleOpenMyCard = () => {
        let player = {
            profileId: settings.profileId,
        }
        getExtraInfo([player], (result) => {
            const ex = result[player.profileId]
            const rank = ex.ranks.find(x => x.members.length === 1)
            const profile = rank.members[0]

            if (result && ex) {
                dispatch({
                    type: 'PLAYER_CARD_ON',
                    data: {
                        player: {
                            name: profile.alias,
                            profileId: profile.profile_id + '',
                            country: profile.country,
                        },
                        extraInfo: ex,
                    }
                })
            }
        }, true)
    }

    // debugger
    const userIcon = settings && settings.steamId
        && !(
            state.view === 'playerCard'
            && state.playerCard.player.profileId === settings.profileId
        )
        ? <NavBarIcon
            title={getText('my_playercard', settings)}
            style={{
                height: '.7em',
                marginRight: '0',
            }}
            icon={faUserAlt}
            fun={handleOpenMyCard}
        />
        : null

    const searchIcon = state.view !== 'search'
        ? <NavBarIcon
            title={getText('search', settings)}
            style={{
                height: '.7em',
                marginRight: '0',
            }}
            icon={faSearch}
            fun={handleSearchView}
        />
        : null

    const settingsIcon = <NavBarIcon
        style={{
            height: '.8em',
            marginLeft: '0',
        }}
        title={getText('settings', settings)}
        icon={faCogs}
        fun={settingsViewToggeler}
    />

    return <div className={styles.navbar} >
        {userIcon}

        {searchIcon}

        <div className={styles.container}>
            <div className={styles.column}>
                <NavbarRow fontSize='60%'>
                    {getText('dropdown_info', settings)}
                </NavbarRow>
                <NavbarRow>
                    {table}
                    {all}
                    {total}
                </NavbarRow>
            </div>

            <div className={styles.column}>
                <NavbarRow fontSize='60%'>
                    {getText('log_checking', settings)}
                </NavbarRow>
                <NavbarRow>
                    <CheckLogDiv />
                </NavbarRow>
            </div>
        </div>

        {settingsIcon}

    </div>
}