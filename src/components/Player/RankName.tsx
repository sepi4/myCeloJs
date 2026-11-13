import { JSX } from 'react'

import cross from '../../assets/img/cross.png'
import star from '../../assets/img/star.png'
import { getFactionCodeByLeaderboardName } from '../../constants/games'
import { useDisplayGame } from '../../hooks/useDisplayGame'
import useText from '../../hooks/useText'
import { Rank } from '../../types'
import { faCaretDown, faCaretRight } from '../icons'
import SvgIcon from '../SvgIcon'
import RankMembers from './RankMembers'

interface Props {
    rank: Rank
    open: boolean
    onToggle: () => void
}

function RankName(props: Props) {
    const { rank } = props
    const getText = useText()
    const game = useDisplayGame()

    const showMembers = props.open
    function betterRankName(leaderboardName: string) {
        const mode = leaderboardName.match(/^\dv\d/)?.[0] ?? ''
        const faction = leaderboardName.slice(mode.length).replace('Unranked', '')
        return `${mode} ${getFactionCodeByLeaderboardName(game, faction) ?? faction}`
    }
    const arrow = (
        <SvgIcon
            icon={showMembers ? faCaretDown : faCaretRight}
            size="lg"
            style={{
                marginRight: '.2em',
                verticalAlign: 'middle',
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
                        // centres the icon on the digits in "3v3", which sit higher than lowercase text
                        verticalAlign: '-0.1em',
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
                        data-testid="rank-toggle"
                        aria-expanded={showMembers}
                        onClick={props.onToggle}
                        style={{ cursor: 'pointer' }}
                    >
                        {arrow}
                        {rankName}
                    </span>
                    {showMembers && <RankMembers members={rank.members} />}
                </div>
            ) : (
                <div>{betterRankName(rank.name)}</div>
            )}
        </div>
    )
}

export default RankName
