import { Member } from '../../types'
import RankMember from './RankMember'

import styles from './RankMembers.module.css'

interface Props {
    members: Member[]
}

function RankMembers(props: Props) {
    return (
        <div style={{ marginBottom: '0.5rem' }}>
            <hr className={styles.divider} />
            {props.members.map((m) => (
                <RankMember key={m.profile_id} member={m} />
            ))}
        </div>
    )
}

export default RankMembers
