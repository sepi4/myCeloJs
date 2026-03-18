import { faCogs, faSearch, faUserAlt } from '@fortawesome/free-solid-svg-icons'

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
    const { openSettingsView, closeSettingsView } = useSettingsViewStore()

    const handleOpenSettings = () => {
        openSettingsView()
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
                title={getText(`tooltip_${text}`, settings)}
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

    const handleSearchView = () => {
        closeSettingsView()
        setView('search')
    }

    const handleOpenMyCard = async () => {
        const id = navButtons.coh3 ? settings!.profileIdCoh3 : settings!.profileIdCoh2
        const x = await getExtraInfo(navButtons.coh3, [id])
        if (!x) {
            return
        }
        const result = x.result
        const ex = result[id]
        const rank = ex.ranks.find((x: Rank) => x.members?.length === 1)
        if (!rank?.members) {
            return
        }
        const profile = rank.members[0]
        if (ex) {
            const playerData = {
                name: profile.alias,
                profileId: profile.profile_id + '',
                country: profile.country,
            }
            setPlayerCard(playerData, ex)
            closeSettingsView()
            setView('playerCard')
        }
    }

    const activeProfileId = navButtons.coh3 ? settings?.profileIdCoh3 : settings?.profileIdCoh2
    const alreadyViewingMyCard =
        view === 'playerCard' && playerCardPlayer?.profileId === activeProfileId
    const userIcon =
        settings && activeProfileId ? (
            <NavBarIcon
                title={getText('my_playercard', settings)}
                testId="user-icon"
                style={{ height: '.7em' }}
                icon={faUserAlt}
                fun={alreadyViewingMyCard ? undefined : handleOpenMyCard}
            />
        ) : null

    const searchIcon = (
        <NavBarIcon
            title={getText('search', settings)}
            testId="search-icon"
            style={{ height: '.7em' }}
            icon={faSearch}
            fun={handleSearchView}
        />
    )

    const settingsIcon = (
        <NavBarIcon
            style={{ height: '.8em' }}
            title={getText('settings', settings)}
            testId="settings-icon"
            icon={faCogs}
            fun={handleOpenSettings}
        />
    )

    const isTop = settings?.sidebarPosition === 'top'
    const navbarClass =
        settings?.sidebarPosition === 'right'
            ? styles.navbarRight
            : isTop
              ? styles.navbarTop
              : styles.navbar

    return (
        <div className={navbarClass}>
            <div className={isTop ? styles.iconsTop : styles.icons}>
                {userIcon}
                {searchIcon}
                {settingsIcon}
            </div>

            <div className={isTop ? styles.containerTop : styles.container}>
                <div className={isTop ? styles.columnTop : styles.column}>
                    <NavbarRow isTop={isTop}>{buttons}</NavbarRow>
                </div>

                <div className={isTop ? styles.columnTop : styles.column}>
                    <NavbarRow isTop={isTop}>
                        <div
                            className={styles.radio}
                            title={
                                !settings?.logLocationCoh2
                                    ? getText('log_not_set', settings)
                                    : 'coh2'
                            }
                        >
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
                        <div
                            className={styles.radio}
                            title={
                                !settings?.logLocationCoh3
                                    ? getText('log_not_set', settings)
                                    : 'coh3'
                            }
                        >
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

                <div className={isTop ? styles.columnTop : styles.column}>
                    <CheckLogDiv />
                </div>
            </div>
        </div>
    )
}
