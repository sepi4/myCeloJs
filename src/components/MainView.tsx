import { JSX, useLayoutEffect } from 'react'

import useActiveLogLocation from '../hooks/useActiveLogLocation'
import useNavigationKeys from '../hooks/useNavigationKeys'
import useText from '../hooks/useText'
import { Location, useNavigationStore } from '../stores/navigationStore'
import { usePlayersStore } from '../stores/playersStore'
import { useSettingsViewStore } from '../stores/settingsViewStore'
import { useViewStore } from '../stores/viewStore'
import { Player } from '../types'
import ClosingViewWrapper from './ClosingViewWrapper/ClosingViewWrapper'
import PlayerCard from './PlayerCard/PlayerCard'
import Search from './Search/Search'
import Settings from './Settings/Settings'
import Team from './Teams/Team'

import styles from './MainView.module.css'

function usesSearch(location: Location) {
    return (
        location.view === 'search' ||
        (location.view === 'playerCard' && location.cardReturnView === 'search')
    )
}

function MainView(props: { handleSetSettingsView: () => void }): JSX.Element {
    const getText = useText()
    const { settingsView } = useSettingsViewStore()
    const teams: [Player[], Player[]] = [[], []]
    const { players } = usePlayersStore()
    const { view, cardReturnView } = useViewStore()
    // Search stays loaded while the history can return to it, so its results are kept.
    const searchInHistory = useNavigationStore((s) => [...s.back, ...s.forward].some(usesSearch))
    const activeLogLocation = useActiveLogLocation()

    if (players) {
        players.forEach((p) => {
            teams[p?.teamSlot]?.push(p)
        })
    }

    useNavigationKeys()

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
    if (!activeLogLocation) {
        return (
            <div className={styles.centered}>
                <h2 data-testid="no-log-prompt">{getText('add_log_location')}</h2>
            </div>
        )
    }
    // Main and search views stay mounted but hidden behind the player card,
    // so their open lists, loaded histories and scroll position are kept.
    const searchMounted = usesSearch({ view, cardReturnView, card: null }) || searchInHistory

    const mainContent =
        players && players.length > 0 ? (
            <div data-testid="players-container">
                <Team players={teams[0]} teamIndex={0} />
                <Team players={teams[1]} teamIndex={1} />
            </div>
        ) : (
            <div className={styles.centered}>
                <h2>{getText('no_info')}</h2>
            </div>
        )

    return (
        <>
            {view === 'playerCard' && (
                <ClosingViewWrapper>
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
