import { JSX, useLayoutEffect } from 'react'

import getText from '../functions/utils/getText'
import { useNavButtonsStore } from '../stores/navButtonsStore'
import { usePlayerCardStore } from '../stores/playerCardStore'
import { usePlayersStore } from '../stores/playersStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useSettingsViewStore } from '../stores/settingsViewStore'
import { useViewStore } from '../stores/viewStore'
import { Player } from '../types'
import ClosingViewWrapper from './ClosingViewWrapper/ClosingViewWrapper'
import styles from './MainView.module.css'
import PlayerCard from './PlayerCard/PlayerCard'
import Search from './Search/Search'
import Settings from './Settings/Settings'
import Team from './Teams/Team'

function MainView(props: { handleSetSettingsView: () => void }): JSX.Element {
    const { settingsView } = useSettingsViewStore()
    const teams: Player[][] = [[], []]
    const { settings } = useSettingsStore()
    const {
        navButtons: { coh3 },
    } = useNavButtonsStore()
    const { players } = usePlayersStore()
    const { view, cardReturnView } = useViewStore()
    const canGoBack = usePlayerCardStore((s) => s.history.length > 0)
    const canGoForward = usePlayerCardStore((s) => s.future.length > 0)
    const goBack = usePlayerCardStore((s) => s.goBack)
    const goForward = usePlayerCardStore((s) => s.goForward)
    const activeLogLocation = settings
        ? coh3
            ? settings.logLocationCoh3
            : settings.logLocationCoh2
        : ''

    if (players) {
        players.forEach((p) => {
            teams[p?.teamSlot]?.push(p)
        })
    }

    // The player card restores its own scroll position.
    useLayoutEffect(() => {
        if (view !== 'playerCard') {
            window.scrollTo(0, useViewStore.getState().scrollPositions[view])
        }
    }, [view])

    if (settingsView) {
        return <Settings handleSetSettingsView={props.handleSetSettingsView} />
    }
    // haven't add log location
    if (!settings || !activeLogLocation) {
        return (
            <div className={styles.centered}>
                <h2 data-testid="no-log-prompt">{getText('add_log_location', settings)}</h2>
            </div>
        )
    }
    // Main and search views stay mounted but hidden behind the player card,
    // so their open lists, loaded histories and scroll position are kept.
    const searchMounted =
        view === 'search' || (view === 'playerCard' && cardReturnView === 'search')

    const mainContent =
        players && players.length > 0 ? (
            <div data-testid="players-container">
                <Team players={teams[0]} teamIndex={0} />
                <Team players={teams[1]} teamIndex={1} />
            </div>
        ) : (
            <div className={styles.centered}>
                <h2>{getText('no_info', settings)}</h2>
            </div>
        )

    return (
        <>
            {view === 'playerCard' && (
                <ClosingViewWrapper
                    navigation={
                        canGoBack || canGoForward
                            ? {
                                  back: {
                                      title: `${getText('back', settings)} (←)`,
                                      enabled: canGoBack,
                                      onClick: goBack,
                                  },
                                  forward: {
                                      title: `${getText('forward', settings)} (→)`,
                                      enabled: canGoForward,
                                      onClick: goForward,
                                  },
                              }
                            : undefined
                    }
                >
                    <PlayerCard />
                </ClosingViewWrapper>
            )}
            {searchMounted && (
                <div hidden={view !== 'search'}>
                    <ClosingViewWrapper>
                        <Search />
                    </ClosingViewWrapper>
                </div>
            )}
            <div hidden={view !== 'main'}>{mainContent}</div>
        </>
    )
}

export default MainView
