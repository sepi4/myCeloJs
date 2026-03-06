import styles from './Navbar.module.css'
import {
    faCogs,
    faSearch,
    faTimes,
    faUserAlt,
} from '@fortawesome/free-solid-svg-icons'

import getText from '../../functions/getText'

import NavCheckbox from './NavCheckBox'
import NavBarIcon from './NavbarIcon'
import CheckLogDiv from './CheckLogDiv'
import NavbarRow from './NavbarRow'
import { getExtraInfo } from '../../functions/getExtraInfo'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { useSettingsViewStore } from '../../stores/settingsViewStore'
import { useViewStore } from '../../stores/viewStore'

import { Rank } from '../../types'

interface Props {
    handleSetSettingsView: () => void
}

export default function Navbar(props: Props) {
    const { settings } = useSettingsStore()
    const { settingsView, toggleSettingsView } = useSettingsViewStore()

    const settingsViewToggeler = () => {
        toggleSettingsView()
        props.handleSetSettingsView()
    }

    const { navButtons, toggleNavButton } = useNavButtonsStore()
    const { setPlayerCard, player: playerCardPlayer } = usePlayerCardStore()
    const { view, setView } = useViewStore()

    const getNavCheckBox = (text: 'all' | 'total' | 'table') => {
        return (
            <NavCheckbox
                key={text}
                text={getText(text, settings)}
                checked={navButtons[text]}
                handler={() => toggleNavButton(text)}
            />
        )
    }

    const buttons = (
        <>
            {getNavCheckBox('all')}
            {getNavCheckBox('total')}
            {getNavCheckBox('table')}
            {/* {!state.navButtons.coh3 && getNavCheckBox('table')} */}
        </>
    )

    if (settingsView) {
        return (
            <div
                className={styles.navbar}
                style={{ justifyContent: 'flex-end' }}
            >
                <NavBarIcon icon={faTimes} fun={settingsViewToggeler} />
            </div>
        )
    }

    const handleSearchView = () => {
        setView('search')
    }

    const handleOpenMyCard = () => {
        const id: number = Number(settings!.profileId)

        getExtraInfo(navButtons.coh3, [id], (result) => {
            const ex = result[id]
            const rank = ex.ranks.find((x: Rank) => x.members?.length === 1)
            if (!rank?.members) {
                return
            }
            const profile = rank.members[0]

            if (result && ex) {
                const playerData = {
                    name: profile.alias,
                    profileId: profile.profile_id + '',
                    country: profile.country,
                }
                setPlayerCard(playerData, ex)
                setView('playerCard')
            }
        })
    }

    let userIcon = null
    if (
        settings &&
        settings.steamId &&
        !(
            view === 'playerCard' &&
            playerCardPlayer?.profileId === settings.profileId
        )
    ) {
        userIcon = (
            <NavBarIcon
                title={getText('my_playercard', settings)}
                style={{
                    height: '.7em',
                    marginRight: '0',
                }}
                icon={faUserAlt}
                fun={handleOpenMyCard}
            />
        )
    }

    const searchIcon =
        view !== 'search' ? (
            <NavBarIcon
                title={getText('search', settings)}
                style={{
                    height: '.7em',
                    marginRight: '0',
                }}
                icon={faSearch}
                fun={handleSearchView}
            />
        ) : null

    const settingsIcon = (
        <NavBarIcon
            style={{
                height: '.8em',
                marginLeft: '0',
            }}
            title={getText('settings', settings)}
            icon={faCogs}
            fun={settingsViewToggeler}
        />
    )

    return (
        <div className={styles.navbar}>
            {!navButtons.coh3 && (
                <>
                    {userIcon}
                    {searchIcon}
                </>
            )}

            <div className={styles.container}>
                <div className={styles.column}>
                    <NavbarRow fontSize="60%">
                        {getText('dropdown_info', settings)}
                    </NavbarRow>
                    <NavbarRow>{buttons}</NavbarRow>
                </div>

                <div className={styles.column}>
                    <NavbarRow fontSize="60%">
                        {getText('game', settings)}
                    </NavbarRow>
                    <NavbarRow>
                        <div className={styles.radio}>
                            <input
                                id="coh2"
                                type="radio"
                                onChange={() => toggleNavButton('coh3')}
                                checked={!navButtons['coh3']}
                            />{' '}
                            <label htmlFor="coh2">coh2</label>
                        </div>
                        <div className={styles.radio}>
                            <input
                                id="coh3"
                                type="radio"
                                onChange={() => toggleNavButton('coh3')}
                                checked={navButtons['coh3']}
                            />{' '}
                            <label htmlFor="coh3">coh3</label>
                        </div>

                        {/* <NavCheckbox
                            key={'coh3'}
                            text={'coh3'}
                            checked={navButtons['coh3']}
                            handler={() =>
                                dispatch({
                                    type: 'TOGGLE_NAVBUTTON',
                                    key: 'coh3',
                                })
                            }
                        /> */}
                    </NavbarRow>
                </div>

                <div className={styles.column}>
                    <NavbarRow fontSize="60%">
                        {getText('log_checking', settings)}
                    </NavbarRow>
                    <NavbarRow>
                        <CheckLogDiv />
                    </NavbarRow>
                </div>
            </div>

            {settingsIcon}
        </div>
    )
}
