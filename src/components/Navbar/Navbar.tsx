import { faCogs, faSearch, faUserAlt } from '@fortawesome/free-solid-svg-icons'

import { getExtraInfo } from '../../functions/api/getExtraInfo'
import getText from '../../functions/utils/getText'
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

    const eloCheckBox = navButtons.coh3 ? (
        <NavCheckbox
            key="elo"
            testId="checkbox-elo"
            text={getText('elo', settings)}
            checked={navButtons.elo}
            handler={() => toggleNavButton('elo')}
            title={getText('tooltip_elo', settings)}
        />
    ) : null

    const buttons = (
        <>
            {getNavCheckBox('all')}
            {getNavCheckBox('total')}
            {getNavCheckBox('table')}
            {eloCheckBox}
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
            setPlayerCard(playerData, ex, navButtons.coh3)
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
                icon={faUserAlt}
                fun={alreadyViewingMyCard ? undefined : handleOpenMyCard}
            />
        ) : null

    const searchIcon = (
        <NavBarIcon
            title={getText('search', settings)}
            testId="search-icon"
            icon={faSearch}
            fun={handleSearchView}
        />
    )

    const settingsIcon = (
        <NavBarIcon
            title={getText('settings', settings)}
            testId="settings-icon"
            icon={faCogs}
            fun={handleOpenSettings}
        />
    )

    const isTop = settings?.navbarPosition !== 'left' && settings?.navbarPosition !== 'right'
    const navbarVariant =
        settings?.navbarPosition === 'right'
            ? styles.navbarRight
            : settings?.navbarPosition === 'left'
              ? styles.navbarLeft
              : styles.navbarTop

    const sep = <div className={isTop ? styles.separatorV : styles.separatorH} />

    return (
        <div data-testid="navbar" className={`${styles.navbarBase} ${navbarVariant}`}>
            <div className={`${styles.iconsBase} ${isTop ? styles.iconsTop : styles.icons}`}>
                {userIcon}
                {searchIcon}
                {settingsIcon}
            </div>

            {!isTop && sep}

            <div className={isTop ? styles.containerTop : styles.container}>
                {isTop && sep}

                <div className={isTop ? styles.columnTop : styles.column}>
                    <NavbarRow isTop={isTop}>{buttons}</NavbarRow>
                </div>

                {sep}

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

                {sep}

                <div className={isTop ? styles.columnTop : styles.column}>
                    <CheckLogDiv />
                </div>
            </div>
        </div>
    )
}
