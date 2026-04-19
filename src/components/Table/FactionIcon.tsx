import { getFactionCodeCoh3 } from '../../constants/factionMappings'
import {
    getFactionFlagLocation,
    getFactionFlagLocationCoh3,
} from '../../functions/utils/getFactionFlagLocation'
import { useDisplayCoh3 } from '../../hooks/useDisplayCoh3'
interface Props {
    faction: string
    size: string
}

function FactionIcon({ faction, size }: Props) {
    const coh3 = useDisplayCoh3()
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
                src={coh3 ? getFactionFlagLocationCoh3(faction) : getFactionFlagLocation(faction)}
                alt={`${faction}`}
                title={coh3 ? getFactionCodeCoh3(faction) : faction}
            />
        </div>
    )
}

export default FactionIcon
