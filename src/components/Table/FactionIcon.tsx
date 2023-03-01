import { getFactionFlagLocation, getFactionFlagLocationCoh3 } from '../../functions/getFactionFlagLocation'
import { useAppSelector } from '../../hooks/customReduxHooks'
import { FactionName } from '../../types'

interface Props {
    faction: FactionName
    size: string
}

function FactionIcon({ faction, size }: Props) {
    const coh3 = useAppSelector((state) => state.navButtons.coh3)
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
            />
        </div>
    )
}

export default FactionIcon
