import { Member as MemberType } from '../../types'
import Member from './Member'

interface Props {
    members: MemberType[]
}

function Members(props: Props) {
    return (
        <div style={{ margin: '0.5rem 0' }}>
            <hr />
            {props.members.map((m) => (
                <Member key={m.profile_id} member={m} />
            ))}
        </div>
    )
}

export default Members
