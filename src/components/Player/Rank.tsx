import { JSX } from 'react'

import cross from '../../assets/img/cross.png'
import star from '../../assets/img/star.png'
import getTextFun from '../../functions/utils/getText'
import { useSettingsStore } from '../../stores/settingsStore'
import { Rank as RankType } from '../../types'
import { faCaretDown, faCaretRight } from '../icons'
import SvgIcon from '../SvgIcon'
import Members from './Members'

interface Props {
    rank: RankType
    open: boolean
    onToggle: () => void
}

function Rank(props: Props) {
    const { rank } = props
    const { settings } = useSettingsStore()
    const getText = (x: string) => getTextFun(x, settings)

    const showMembers = props.open
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
            case 'American':
                return 'usa'
            case 'DAK':
                return 'dak'
            default:
                return x
        }
    }
    function betterRankName(rn: string) {
        const m = rn.match(/^\dv\d/)
        rn = rn.replace(/^(\dv\d)/, '').replace('Unranked', '')
        return m + ' ' + sw(rn)
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
                    {showMembers && <Members members={rank.members} />}
                </div>
            ) : (
                <div>{betterRankName(rank.name)}</div>
            )}
        </div>
    )
}

export default Rank
