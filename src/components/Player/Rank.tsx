import React from 'react'
import { useState } from 'react'
import getTextFun from '../../functions/getText'

import Members from './Members'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'

import star from '../../../img/star.png'
import cross from '../../../img/cross.png'

import { Rank as RankType } from '../../types'
import { useAppSelector } from '../../hooks/customReduxHooks'

interface Props {
    rank: RankType
}

function Rank(props: Props) {
    const { rank } = props
    const settings = useAppSelector((state) => state.settings)
    const getText = (x: string) => getTextFun(x, settings)

    const [showMembers, setShowMembers] = useState(false)
    function sw(x: string) {
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
    function betterRankName(rn: string) {
        const m = rn.match(/^\dv\d/)
        rn = rn.replace(/^(\dv\d)/, '')
        return m + ' ' + sw(rn)
    }

    const arrow = (
        <FontAwesomeIcon
            icon={showMembers ? faCaretDown : faCaretRight}
            size="lg"
            style={{
                color: 'green',
                marginRight: '.2em',
            }}
        />
    )

    let rankName: string | JSX.Element = rank.name
    const matched = rankName.match(/^TeamOf(\d)(.+)$/)
    if (matched) {
        rankName = (
            <>
                {`${getText('team_of')} ${matched[1]}v${matched[1]} `}
                <img
                    src={matched[2] === 'Axis' ? cross : star}
                    style={{
                        height: '1em',
                    }}
                />
            </>
        )
    }

    return (
        <div>
            {rank.members && rank.members.length > 1 ? (
                <div>
                    <span
                        onClick={() => setShowMembers(!showMembers)}
                        style={{ cursor: 'pointer' }}
                    >
                        {arrow}
                        {rankName}
                    </span>
                    {showMembers && <Members members={rank.members} />}
                </div>
            ) : (
                <div>{betterRankName(rank.name)}</div>
            )}
        </div>
    )
}

export default Rank
