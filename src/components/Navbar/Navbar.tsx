import { GAME_CONFIG, GAMES } from '../../constants/games'
import { getExtraInfo } from '../../functions/api/getExtraInfo'
import getText from '../../functions/utils/getText'
import { useGameStore } from '../../stores/gameStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useSettingsViewStore } from '../../stores/settingsViewStore'
import { useViewStore } from '../../stores/viewStore'
import { Rank } from '../../types'
import Choice from '../Choice'
import { faArrowLeft, faArrowRight, faCogs, faSearch, faUserAlt } from '../icons'
import CheckLogDiv from './CheckLogDiv'
import NavBarIcon from './NavbarIcon'
import NavbarRow from './NavbarRow'

import styles from './Navbar.module.css'

interface Props {
    handleSetSettingsView: () => void
}

export default function Navbar(props: Props) {
    const { settings } = useSettingsStore()
    const { settingsView, openSettingsView, closeSettingsView } = useSettingsViewStore()

    const handleOpenSettings = () => {
        openSettingsView()
        props.handleSetSettingsView()
    }

    const { game, setGame } = useGameStore()
    const { navButtons, toggleNavButton } = useNavButtonsStore()
    const playerCardPlayer = usePlayerCardStore((s) => s.player)
    const { view } = useViewStore()
    const { openView, openPlayerCard, goBack, goForward } = useNavigationStore()
    const canGoBack = useNavigationStore((s) => s.back.length > 0) && !settingsView
    const canGoForward = useNavigationStore((s) => s.forward.length > 0) && !settingsView

    const getNavCheckBox = (text: 'all' | 'total' | 'table') => {
        return (
            <Choice
                key={text}
                type="checkbox"
                testId={`checkbox-${text}`}
                label={getText(text, settings)}
                checked={navButtons[text]}
                onChange={() => toggleNavButton(text)}
                title={getText(`tooltip_${text}`, settings)}
            />
        )
    }

    const eloCheckBox = GAME_CONFIG[game].hasElo ? (
        <Choice
            key="elo"
            type="checkbox"
            testId="checkbox-elo"
            label={getText('elo', settings)}
            checked={navButtons.elo}
            onChange={() => toggleNavButton('elo')}
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
        openView('search')
    }

    const activeProfileId = settings?.[GAME_CONFIG[game].profileIdKey]

    const handleOpenMyCard = async () => {
        const id = activeProfileId
        if (!id) {
            return
        }
        const x = await getExtraInfo(game, [id])
        if (!x) {
            return
        }
        const result = x.result
        const ex = result[id]
        const rank = ex.ranks.find((r: Rank) => r.members?.length === 1)
        if (!rank?.members) {
            return
        }
        const profile = rank.members[0]
        if (ex) {
            const playerData = {
                name: profile.alias,
                profileId: profile.profile_id,
                country: profile.country,
            }
            closeSettingsView()
            openPlayerCard(playerData, ex, game)
        }
    }

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

    const backIcon = (
        <NavBarIcon
            title={`${getText('back', settings)} (←)`}
            testId="back-button"
            icon={faArrowLeft}
            fun={canGoBack ? goBack : undefined}
            disabled={!canGoBack}
        />
    )

    const forwardIcon = (
        <NavBarIcon
            title={`${getText('forward', settings)} (→)`}
            testId="forward-button"
            icon={faArrowRight}
            fun={canGoForward ? goForward : undefined}
            disabled={!canGoForward}
        />
    )

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
                {backIcon}
                {forwardIcon}
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
                        {GAMES.map((option) => {
                            const logLocation = settings?.[GAME_CONFIG[option].logLocationKey]
                            return (
                                <Choice
                                    key={option}
                                    type="radio"
                                    testId={`radio-${option}`}
                                    label={option}
                                    checked={game === option}
                                    onChange={() => setGame(option)}
                                    disabled={!logLocation}
                                    title={logLocation ? option : getText('log_not_set', settings)}
                                />
                            )
                        })}
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
