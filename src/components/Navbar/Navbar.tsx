import { GAME_CONFIG, GAMES } from '../../constants/games'
import { fetchPlayerRanks } from '../../functions/api/fetchPlayerRanks'
import useNavbarPosition from '../../hooks/useNavbarPosition'
import useText from '../../hooks/useText'
import { DisplayOptions, useDisplayOptionsStore } from '../../stores/displayOptionsStore'
import { useGameStore } from '../../stores/gameStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useSettingsViewStore } from '../../stores/settingsViewStore'
import { useViewStore } from '../../stores/viewStore'
import Choice from '../Choice'
import { faArrowLeft, faArrowRight, faCogs, faSearch, faUserAlt } from '../icons'
import LogControls from './LogControls'
import NavBarIcon from './NavbarIcon'
import NavbarRow from './NavbarRow'

import styles from './Navbar.module.css'

const navbarClass = {
    top: styles.navbarTop,
    left: styles.navbarLeft,
    right: styles.navbarRight,
}

interface Props {
    handleSetSettingsView: () => void
}

export default function Navbar(props: Props) {
    const getText = useText()
    const { settings } = useSettingsStore()
    const { settingsView, openSettingsView, closeSettingsView } = useSettingsViewStore()

    const handleOpenSettings = () => {
        openSettingsView()
        props.handleSetSettingsView()
    }

    const { game, setGame } = useGameStore()
    const { displayOptions, toggleDisplayOption } = useDisplayOptionsStore()
    const playerCardPlayer = usePlayerCardStore((s) => s.player)
    const { view } = useViewStore()
    const { openView, openPlayerCard, goBack, goForward } = useNavigationStore()
    const canGoBack = useNavigationStore((s) => s.back.length > 0) && !settingsView
    const canGoForward = useNavigationStore((s) => s.forward.length > 0) && !settingsView

    const getNavCheckBox = (text: 'all' | 'total' | 'table', option: keyof DisplayOptions) => {
        return (
            <Choice
                key={text}
                type="checkbox"
                testId={`checkbox-${text}`}
                label={getText(text)}
                checked={displayOptions[option]}
                onChange={() => toggleDisplayOption(option)}
                title={getText(`tooltip_${text}`)}
            />
        )
    }

    const eloCheckBox = GAME_CONFIG[game].hasElo ? (
        <Choice
            key="elo"
            type="checkbox"
            testId="checkbox-elo"
            label={getText('elo')}
            checked={displayOptions.showElo}
            onChange={() => toggleDisplayOption('showElo')}
            title={getText('tooltip_elo')}
        />
    ) : null

    const buttons = (
        <>
            {getNavCheckBox('all', 'showAll')}
            {getNavCheckBox('total', 'showTotal')}
            {getNavCheckBox('table', 'tableView')}
            {eloCheckBox}
        </>
    )

    const handleSearchView = () => {
        closeSettingsView()
        openView('search')
    }

    const activeProfileId = settings?.[GAME_CONFIG[game].profileIdKey]

    const handleOpenMyCard = async () => {
        if (!activeProfileId) {
            return
        }
        const playerRanks = await fetchPlayerRanks(game, activeProfileId)
        const profile = playerRanks?.ranks.find((r) => r.members?.length === 1)?.members?.[0]
        if (!playerRanks || !profile) {
            return
        }
        closeSettingsView()
        openPlayerCard(
            { name: profile.alias, profileId: profile.profile_id, country: profile.country },
            playerRanks,
            game
        )
    }

    const alreadyViewingMyCard =
        view === 'playerCard' && playerCardPlayer?.profileId === activeProfileId
    const userIcon =
        settings && activeProfileId ? (
            <NavBarIcon
                title={getText('my_playercard')}
                testId="user-icon"
                icon={faUserAlt}
                onClick={alreadyViewingMyCard ? undefined : handleOpenMyCard}
            />
        ) : null

    const backIcon = (
        <NavBarIcon
            title={`${getText('back')} (←)`}
            testId="back-button"
            icon={faArrowLeft}
            onClick={canGoBack ? goBack : undefined}
            disabled={!canGoBack}
        />
    )

    const forwardIcon = (
        <NavBarIcon
            title={`${getText('forward')} (→)`}
            testId="forward-button"
            icon={faArrowRight}
            onClick={canGoForward ? goForward : undefined}
            disabled={!canGoForward}
        />
    )

    const searchIcon = (
        <NavBarIcon
            title={getText('search')}
            testId="search-icon"
            icon={faSearch}
            onClick={handleSearchView}
        />
    )

    const settingsIcon = (
        <NavBarIcon
            title={getText('settings')}
            testId="settings-icon"
            icon={faCogs}
            onClick={handleOpenSettings}
        />
    )

    const navbarPosition = useNavbarPosition()
    const isTop = navbarPosition === 'top'

    const sep = <div className={isTop ? styles.separatorV : styles.separatorH} />

    return (
        <div data-testid="navbar" className={`${styles.navbarBase} ${navbarClass[navbarPosition]}`}>
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
                                    title={logLocation ? option : getText('log_not_set')}
                                />
                            )
                        })}
                    </NavbarRow>
                </div>

                {sep}

                <div className={isTop ? styles.columnTop : styles.column}>
                    <LogControls />
                </div>
            </div>
        </div>
    )
}
