import { useEffect, useRef, useState } from 'react'

import { GAME_CONFIG } from '../../constants/games'
import { samplePlayers } from '../../functions/rankings/samplePlayers'
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
    horizontal: boolean
    html: boolean
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

    const sizes = props.html ? PAGE_SIZE.html : PAGE_SIZE.txt
    const page = props.horizontal ? sizes.horizontal : sizes.vertical

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

    let sampleDoc: string | undefined
    if (!hasPlayers) {
        const { json, text } = buildRankings(
            game,
            samplePlayers(game),
            props.horizontal,
            GAME_CONFIG[game].hasElo && showElo
        )
        const body = props.html ? renderRankingsBody(json) : renderRankingsTxtBody(text)
        // The base makes the image paths load from the overlay server.
        sampleDoc = `<!doctype html><html><head><base href="${props.url}/"><style>${RANKINGS_CSS}</style></head><body>${body}</body></html>`
    }

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
