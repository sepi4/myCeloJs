import { getFactionFlagLocation } from '../../functions/getFactionFlagLocation'
import { FactionName } from '../../types'

interface Props {
    faction: FactionName
    size: string
}

function FactionIcon({ faction, size }: Props) {
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
                src={getFactionFlagLocation(faction)}
                alt={`${faction}`}
            />
        </div>
    )
}

export default FactionIcon
