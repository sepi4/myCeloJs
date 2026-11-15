import { useEffect, useMemo, useRef, useState } from 'react'

import { isOverlayHtml, rankingsOptions } from '../../functions/rankings/rankingsOptions'
import { sampleAvatars, samplePlayers } from '../../functions/rankings/samplePlayers'
import { buildRankings } from '../../functions/rankings/writeRankings'
import useText from '../../hooks/useText'
import { RANKINGS_CSS } from '../../main/overlayServer/rankingsCss'
import {
    renderRankingsBody,
    renderRankingsTxtBody,
} from '../../main/overlayServer/renderRankingsHtml'
import { useDisplayOptionsStore } from '../../stores/displayOptionsStore'
import { useGameStore } from '../../stores/gameStore'
import { usePlayersStore } from '../../stores/playersStore'
import { SettingsType } from '../../types'

import styles from './OverlayPreview.module.css'

// The overlay page lays itself out by its own width, so it is rendered at a typical
// OBS source size and scaled down. The heights fit a 4v4 game, and the txt widths fit
// its fixed-width lines with ELO.
const PAGE_SIZE = {
    html: {
        horizontal: { width: 800, height: 115 },
        vertical: { width: 450, height: 245 },
    },
    txt: {
        horizontal: { width: 1000, height: 115 },
        vertical: { width: 500, height: 245 },
    },
}

interface Props {
    url: string
    settings: SettingsType
}

export default function OverlayPreview(props: Props) {
    const getText = useText()
    const { players } = usePlayersStore()
    const { game } = useGameStore()
    const {
        displayOptions: { showElo },
    } = useDisplayOptionsStore()
    const frameRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(0)

    const html = isOverlayHtml(props.settings)
    const {
        horizontal,
        showElo: elo,
        showCountry,
        showAvatar,
    } = rankingsOptions(game, props.settings, showElo)
    const sizes = html ? PAGE_SIZE.html : PAGE_SIZE.txt
    const page = horizontal ? sizes.horizontal : sizes.vertical

    useEffect(() => {
        const frame = frameRef.current
        if (!frame) {
            return
        }
        const observer = new ResizeObserver(() => {
            setScale(Math.min(1, frame.clientWidth / page.width))
        })
        observer.observe(frame)
        return () => observer.disconnect()
    }, [page.width])

    const hasPlayers = players !== null && players.length > 0

    const sampleDoc = useMemo(() => {
        if (hasPlayers) {
            return undefined
        }
        const { json, text } = buildRankings(game, samplePlayers(game), {
            horizontal,
            showElo: elo,
            showCountry,
            showAvatar,
            avatars: sampleAvatars(),
        })
        const body = html ? renderRankingsBody(json) : renderRankingsTxtBody(text)
        // The base makes the image paths load from the overlay server.
        return `<!doctype html><html><head><base href="${props.url}/"><style>${RANKINGS_CSS}</style></head><body>${body}</body></html>`
    }, [hasPlayers, game, horizontal, elo, showCountry, showAvatar, html, props.url])

    return (
        <div className={styles.preview} data-testid="overlay-preview">
            <div className={styles.title}>
                {getText('overlay_preview')}
                {!hasPlayers && (
                    <span className={styles.sample} data-testid="overlay-preview-sample">
                        {' '}
                        ({getText('overlay_preview_sample')})
                    </span>
                )}
            </div>
            <div ref={frameRef} className={styles.frame} style={{ height: page.height * scale }}>
                <iframe
                    key={hasPlayers ? 'live' : 'sample'}
                    className={styles.iframe}
                    src={hasPlayers ? props.url : undefined}
                    srcDoc={sampleDoc}
                    title={getText('overlay_preview')}
                    tabIndex={-1}
                    sandbox="allow-scripts"
                    style={{
                        width: page.width,
                        height: page.height,
                        transform: `scale(${scale})`,
                    }}
                />
            </div>
        </div>
    )
}
