import React from 'react'
import Member from './Member'

function Members({ members }) {

    return <div style={{ margin: '0.5rem 0' }}>
        <hr />
        {members.map(m => (
            <Member key={m.profile_id} m={m} />
        ))}
    </div>
}

export default Members