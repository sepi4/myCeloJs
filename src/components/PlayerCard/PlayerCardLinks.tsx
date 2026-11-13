import logo_coh2 from '../../assets/img/logo_coh2.png'
import logo_cohstats from '../../assets/img/logo_cohstats.png'
import logo_steam from '../../assets/img/logo_steam.png'
import { Game } from '../../constants/games'
import { COH2_ORG, COH2STATS_COM, COH3STATS_COM, STEAM } from '../../constants/urls'
import { PlayerCardData } from '../../stores/playerCardStore'

import styles from './PlayerCard.module.css'

interface LinkProps {
    testId: string
    baseUrl: string
    id: string | number | undefined
    logo: string
    alt: string
    title: string
}

function Link({ testId, baseUrl, id, logo, alt, title }: LinkProps) {
    const url = baseUrl + id
    return (
        <img
            data-testid={testId}
            data-url={url}
            src={logo}
            alt={alt}
            title={title}
            onClick={() => (id ? window.electronAPI.shell.openExternal(url) : null)}
        />
    )
}

interface Props {
    game: Game
    steamId: string | undefined
    profileId: PlayerCardData['profileId']
}

export default function PlayerCardLinks({ game, steamId, profileId }: Props) {
    const steamLink = (
        <Link
            testId="link-steam"
            baseUrl={STEAM}
            id={steamId}
            logo={logo_steam}
            alt="steam"
            title="steam"
        />
    )

    if (game === 'coh3') {
        return (
            <div className={styles.links}>
                <Link
                    testId="link-coh3stats"
                    baseUrl={COH3STATS_COM}
                    id={profileId}
                    logo={logo_cohstats}
                    alt="coh3stats"
                    title="coh3stats.com"
                />
                {steamLink}
            </div>
        )
    }

    return (
        <div className={styles.links}>
            <Link
                testId="link-coh2stats"
                baseUrl={COH2STATS_COM}
                id={steamId}
                logo={logo_cohstats}
                alt="coh2stats"
                title="coh2stats.com"
            />
            <Link
                testId="link-coh2"
                baseUrl={COH2_ORG}
                id={steamId}
                logo={logo_coh2}
                alt="coh2"
                title="coh2.org"
            />
            {steamLink}
        </div>
    )
}
