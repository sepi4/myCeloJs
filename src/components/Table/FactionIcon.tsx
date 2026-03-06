import {
    getFactionFlagLocation,
    getFactionFlagLocationCoh3,
} from '../../functions/getFactionFlagLocation'
import { FactionName } from '../../types'
import { useNavButtonsStore } from '../../stores/navButtonsStore'

interface Props {
    faction: FactionName
    size: string
}

function FactionIcon({ faction, size }: Props) {
    const {
        navButtons: { coh3 },
    } = useNavButtonsStore()
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
                src={
                    coh3
                        ? getFactionFlagLocationCoh3(faction)
                        : getFactionFlagLocation(faction)
                }
                alt={`${faction}`}
            />
        </div>
    )
}

export default FactionIcon
