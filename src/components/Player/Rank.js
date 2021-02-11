import React from 'react'
import { useState } from 'react'

import Members from '../Player/Members'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'

function Rank({ style, rank }) {
    const [showMembers, setShowMembers] = useState(false)
    function sw(x) {
        switch (x) {
            case 'Soviet':
                return 'sov'
            case 'German':
                return 'wer'
            case 'AEF':
                return 'usa'
            case 'British':
                return 'uk'
            case 'WestGerman':
                return 'okw'
            default:
                return x
        }
    }
    function betterRankName(rn) {
        let m = rn.match(/^\dv\d/)
        rn = rn.replace(/^(\dv\d)/, '')
        return m + ' ' + sw(rn)
    }

    return <div style={style}>
        {rank.members.length > 1
            ? <div>
                <span
                    onClick={() => setShowMembers(!showMembers)}
                    style={{ cursor: 'pointer' }}
                >
                    <FontAwesomeIcon
                        icon={showMembers ? faCaretDown : faCaretRight}
                        size='lg'
                        style={{
                            color: 'green',
                            marginRight: '.2em',
                        }}
                    />

                    {rank.name}
                </span>
                {showMembers && <Members members={rank.members} />}
            </div>
            : <div>{betterRankName(rank.name)}</div>
        }
    </div>

}

export default Rank