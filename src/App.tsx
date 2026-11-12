import MainView from './components/MainView'
import Navbar from './components/Navbar/Navbar'
import UpdateBar from './components/UpdateBar'
import useAppearance from './hooks/useAppearance'
import useExtraInfo from './hooks/useExtraInfo'
import useLoadSettings from './hooks/useLoadSettings'
import useLogPolling from './hooks/useLogPolling'
import useProfileIdSync from './hooks/useProfileIdSync'
import useRankingsFile from './hooks/useRankingsFile'
import { useSettingsStore } from './stores/settingsStore'

import styles from './App.module.css'
const appVersion = window.electronAPI.appVersion

document.title = 'myCelo ' + appVersion

function App() {
    const { settings } = useSettingsStore()

    useLoadSettings()
    const handleSetSettingsView = useLogPolling()
    useExtraInfo()
    useRankingsFile()
    useProfileIdSync()
    useAppearance()

    return (
        <main
            className={
                settings?.navbarPosition === 'right'
                    ? styles.navbarRight
                    : settings?.navbarPosition === 'left'
                      ? styles.navbarLeft
                      : styles.navbarTop
            }
        >
            <Navbar {...{ handleSetSettingsView }} />
            <MainView handleSetSettingsView={handleSetSettingsView} />

            {settings && <UpdateBar />}
        </main>
    )
}

export default App
