import { faCogs, faSearch, faTimes, faUserAlt } from '@fortawesome/free-solid-svg-icons'

import { getExtraInfo } from '../../functions/getExtraInfo'
import getText from '../../functions/getText'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useSettingsViewStore } from '../../stores/settingsViewStore'
import { useViewStore } from '../../stores/viewStore'
import { Rank } from '../../types'
import CheckLogDiv from './CheckLogDiv'
import styles from './Navbar.module.css'
import NavBarIcon from './NavbarIcon'
import NavbarRow from './NavbarRow'
import NavCheckbox from './NavCheckBox'

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
                testId={`checkbox-${text}`}
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
            <div className={styles.navbar} style={{ justifyContent: 'flex-end' }}>
                <NavBarIcon icon={faTimes} fun={settingsViewToggeler} testId="close-button" />
            </div>
        )
    }

    const handleSearchView = () => {
        setView('search')
    }

    const handleOpenMyCard = () => {
        const id = navButtons.coh3 ? settings!.profileIdCoh3 : settings!.profileIdCoh2

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

    const activeProfileId = navButtons.coh3 ? settings?.profileIdCoh3 : settings?.profileIdCoh2
    let userIcon = null
    if (
        settings &&
        activeProfileId &&
        !(view === 'playerCard' && playerCardPlayer?.profileId === activeProfileId)
    ) {
        userIcon = (
            <NavBarIcon
                title={getText('my_playercard', settings)}
                testId="user-icon"
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
                testId="search-icon"
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
            testId="settings-icon"
            icon={faCogs}
            fun={settingsViewToggeler}
        />
    )

    return (
        <div className={styles.navbar}>
            {userIcon}
            {!navButtons.coh3 && searchIcon}

            <div className={styles.container}>
                <div className={styles.column}>
                    <NavbarRow fontSize="60%">{getText('dropdown_info', settings)}</NavbarRow>
                    <NavbarRow>{buttons}</NavbarRow>
                </div>

                <div className={styles.column}>
                    <NavbarRow fontSize="60%">{getText('game', settings)}</NavbarRow>
                    <NavbarRow>
                        <div className={styles.radio}>
                            <input
                                data-testid="radio-coh2"
                                id="coh2"
                                type="radio"
                                onChange={() => toggleNavButton('coh3')}
                                checked={!navButtons['coh3']}
                                disabled={!settings?.logLocationCoh2}
                            />{' '}
                            <label htmlFor="coh2">coh2</label>
                        </div>
                        <div className={styles.radio}>
                            <input
                                data-testid="radio-coh3"
                                id="coh3"
                                type="radio"
                                onChange={() => toggleNavButton('coh3')}
                                checked={navButtons['coh3']}
                                disabled={!settings?.logLocationCoh3}
                            />{' '}
                            <label htmlFor="coh3">coh3</label>
                        </div>
                    </NavbarRow>
                </div>

                <div className={styles.column}>
                    <NavbarRow fontSize="60%">{getText('log_checking', settings)}</NavbarRow>
                    <NavbarRow>
                        <CheckLogDiv />
                    </NavbarRow>
                </div>
            </div>

            {settingsIcon}
        </div>
    )
}
