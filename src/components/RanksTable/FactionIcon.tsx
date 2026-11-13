import { getFactionFlag } from '../../constants/games'
import { useDisplayGame } from '../../hooks/useDisplayGame'

interface Props {
    faction: string
    size: string
}

function FactionIcon({ faction, size }: Props) {
    const game = useDisplayGame()
    return (
        <div
            style={{
                display: 'grid',
                placeItems: 'center',
            }}
        >
            <img
                style={{
                    width: size,
                    height: size,
                }}
                src={getFactionFlag(game, faction)}
                alt={`${faction}`}
                title={faction}
            />
        </div>
    )
}

export default FactionIcon
