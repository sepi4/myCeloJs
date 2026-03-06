import Team from './Teams/Team'
import Settings from './Settings/Settings'
import PlayerCard from './PlayerCard/PlayerCard'

import getText from '../functions/getText'
import Search from './Search/Search'
import ClosingViewWrapper from './ClosingViewWrapper/ClosingViewWrapper'
import { usePlayersStore } from '../stores/playersStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useSettingsViewStore } from '../stores/settingsViewStore'
import { useViewStore } from '../stores/viewStore'
import { Player } from '../types'

function MainView(props: { handleSetSettingsView: () => void }): JSX.Element {
    const { settingsView } = useSettingsViewStore()
    const teams: Player[][] = [[], []]
    const { settings } = useSettingsStore()
    const { players } = usePlayersStore()
    const { view } = useViewStore()

    if (players) {
        players.forEach((p) => {
            teams[p?.teamSlot]?.push(p)
        })
    }

    if (settingsView) {
        return <Settings handleSetSettingsView={props.handleSetSettingsView} />
    }
    // haven't add log location
    if (!settings || !settings.logLocation) {
        return (
            <div>
                <h2>{getText('add_log_location', settings)}</h2>
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
            <div>
                <Team players={teams[0]} teamIndex={0} />
                <Team players={teams[1]} teamIndex={1} />
            </div>
        )
    }
    return (
        <div>
            <h2>{getText('no_info', settings)}</h2>
        </div>
    )
}

export default MainView
