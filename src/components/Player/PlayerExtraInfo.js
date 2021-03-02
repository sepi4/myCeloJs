import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import axios from 'axios'

import styled from 'styled-components'

import TableDiv from '../Table/TableDiv'
import ListDiv from '../ListDiv/ListDiv'

const Div = styled.div`
    color: #ddd;
    padding: 0.5em 0;
`

function PlayerExtraInfo({
    extraInfo,
    player,
}) {
    let ranksArr = extraInfo && extraInfo.ranks
    const navButtons = useSelector(state => state.navButtons)

    const [history, setHistory] = useState(null)
    const getHistory = () => {
        let arr = []
        const url = 'https://coh2-api.reliclink.com/community/leaderboard/'
            + 'getRecentMatchHistory?title=coh2&profile_ids=[' + player.profileId + ']'
        axios.get(url)
            .then(res => {
                // console.log(data)
                const { data } = res
                const { matchHistoryStats, profiles } = data
                const matches = matchHistoryStats.sort((a, b) => {
                    return b.completiontime - a.completiontime
                })
                console.log(matches)

                matches.forEach(m => {
                    let mObj = {}

                    mObj.startGameTime = new Date(m.startgametime * 1000)
                    mObj.endGameTime = new Date(m.completiontime * 1000)
                    mObj.mapName = m.mapname
                    mObj.players = m.matchhistoryreportresults
                    mObj.result = m.matchhistoryreportresults.find(r => {
                        return r.profile_id.toString() === player.profileId
                    })
                    mObj.counters = JSON.parse(mObj.result.counters)

                    if (mObj.result.resulttype === 1) {
                        mObj.result = 'Win'
                    } else if (mObj.result.resulttype === 0) {
                        mObj.result = 'Loss'
                    } else {
                        mObj.result = '?'
                    }

                    arr.push(mObj)
                })
                console.log(arr)

                setHistory(arr)
            })
            .catch(error => {
                if (error) {
                    console.log('error get history: ', error)
                }
            })
    }

    const historyDivs = history && history.map((m, i) => {
        console.log(m.counters)
        return <div key={i} style={{ margin: '1em 0' }}>
            <div>result: {m.result}</div>

            <div>start time: {m.startGameTime.toLocaleString()}</div>
            <div>end time: {m.endGameTime.toLocaleString()}</div>

            <div>map: {m.mapName}</div>
            <div>couters: {JSON.stringify(m.counters, null, 4)}</div>

        </div>
    })

    return <Div>
        {/* <div style={{ margin: '1em 0', }}>
            <button onClick={getHistory}>history</button>
            {historyDivs}
        </div> */}

        {navButtons.table && ranksArr &&
            <TableDiv ranksArr={ranksArr} />
        }
        <ListDiv ranksArr={ranksArr} />
    </Div>

}

export default PlayerExtraInfo