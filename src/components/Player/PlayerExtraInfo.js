import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import axios from 'axios'

import styled from 'styled-components'

import TableDiv from '../Table/TableDiv'
import ListDiv from '../ListDiv/ListDiv'
import GameHistoryDiv from './GameHistoryDiv'

const Div = styled.div`
    color: #ddd;
    padding: 0.5em 0;
`

const TotalDiv = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 1em;
    font-size: 80%;
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

        const fetch1 = axios.get(url)

        const url2 =
            'https://coh2-api.reliclink.com/' +
            'community/leaderboard/GetAvailableLeaderboards?title=coh2'

        const fetch2 = axios.get(url2)

        Promise.all([fetch1, fetch2])
            .then(res => {
                console.log('res:', res)
                const { data } = res[0]
                const { matchTypes } = res[1].data
                const { matchHistoryStats, profiles } = data
                const matches = matchHistoryStats.sort((a, b) => {
                    return b.completiontime - a.completiontime
                })
                // console.log(matches)

                matches.forEach(m => {
                    let mObj = {}

                    mObj.startGameTime = new Date(m.startgametime * 1000)
                    mObj.endGameTime = new Date(m.completiontime * 1000)
                    mObj.mapName = m.mapname
                    mObj.players = m.matchhistoryreportresults.map(p => {
                        try {
                            p.counters = JSON.parse(p.counters)
                        } catch (error) {
                            //
                        }
                        return p
                    })
                    mObj.matchType = matchTypes.find(t => t.id === m.matchtype_id)
                    mObj.description = m.description
                    mObj.all = m
                    if (mObj.players.length === 0) {
                        return
                    }
                    mObj.result = m.matchhistoryreportresults.find(r => {
                        return r.profile_id.toString() === player.profileId
                    })
                    if (!mObj.result) {
                        console.log(mObj)
                    }
                    // mObj.counters = JSON.parse(mObj.result.counters)
                    mObj.counters = mObj.result.counters

                    arr.push(mObj)
                })

                let objProfiles = {}
                profiles.forEach(p => objProfiles[p.profile_id] = p)

                setHistory({
                    matchHistoryStats: arr,
                    profiles: objProfiles,
                })
            })
            .catch(error => {
                if (error) {
                    console.log('error get history: ', error)
                }
            })
    }

    const historyDivs = history && history.matchHistoryStats.map((m, i) => {
        // console.log(m.counters)

        return <GameHistoryDiv
            key={i}
            game={m}
            profiles={history.profiles}
        />
    })

    const totalGames = (() => {
        if (!navButtons.total) {
            return null
        }
        let sum = 0
        for (const rankObj of ranksArr) {
            sum += rankObj.wins + rankObj.losses
        }
        return <TotalDiv>
            <p>total games: {sum}</p>
        </TotalDiv>
    })()

    return <Div>
        {totalGames}
        {navButtons.table && ranksArr &&
            <TableDiv ranksArr={ranksArr} />
        }
        <ListDiv ranksArr={ranksArr} />
        {!history
            && <button onClick={getHistory}>show history</button>
        }
        <div style={{
            margin: '1em 0',
            display: 'flex',
            flexWrap: 'wrap',
        }}>
            {historyDivs}
        </div>
    </Div>
}

export default PlayerExtraInfo