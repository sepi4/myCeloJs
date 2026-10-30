import { Member as MemberType } from '../../types'
import Member from './Member'

import styles from './Members.module.css'

interface Props {
    members: MemberType[]
}

function Members(props: Props) {
    return (
        <div style={{ marginBottom: '0.5rem' }}>
            <hr className={styles.divider} />
            {props.members.map((m) => (
                <Member key={m.profile_id} member={m} />
            ))}
        </div>
    )
}

export default Members
