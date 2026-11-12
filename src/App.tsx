import MainView from './components/MainView'
import Navbar from './components/Navbar/Navbar'
import UpdateBar from './components/UpdateBar'
import useAppearance from './hooks/useAppearance'
import useExtraInfo from './hooks/useExtraInfo'
import useLoadSettings from './hooks/useLoadSettings'
import useLogPolling from './hooks/useLogPolling'
import useNavbarPosition from './hooks/useNavbarPosition'
import useProfileIdSync from './hooks/useProfileIdSync'
import useRankingsFile from './hooks/useRankingsFile'
import { useSettingsStore } from './stores/settingsStore'

import styles from './App.module.css'
const appVersion = window.electronAPI.appVersion

document.title = 'myCelo ' + appVersion

const navbarClass = {
    top: styles.navbarTop,
    left: styles.navbarLeft,
    right: styles.navbarRight,
}

function App() {
    const { settings } = useSettingsStore()
    const navbarPosition = useNavbarPosition()

    useLoadSettings()
    const handleSetSettingsView = useLogPolling()
    useExtraInfo()
    useRankingsFile()
    useProfileIdSync()
    useAppearance()

    return (
        <main className={navbarClass[navbarPosition]}>
            <Navbar {...{ handleSetSettingsView }} />
            <MainView handleSetSettingsView={handleSetSettingsView} />

            {settings && <UpdateBar />}
        </main>
    )
}

export default App
