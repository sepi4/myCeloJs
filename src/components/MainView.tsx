import { JSX } from 'react'

import getText from '../functions/getText'
import { useNavButtonsStore } from '../stores/navButtonsStore'
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
    const { view } = useViewStore()
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
    if (view === 'playerCard') {
        return (
            <ClosingViewWrapper>
                <PlayerCard />
            </ClosingViewWrapper>
        )
    }
    if (view === 'search') {
        return (
            <ClosingViewWrapper>
                <Search />
            </ClosingViewWrapper>
        )
    }

    if (players && players.length > 0) {
        return (
            <div data-testid="players-container">
                <Team players={teams[0]} teamIndex={0} />
                <Team players={teams[1]} teamIndex={1} />
            </div>
        )
    }
    return (
        <div className={styles.centered}>
            <h2>{getText('no_info', settings)}</h2>
        </div>
    )
}

export default MainView
