import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

// import CheckBox from './CheckBox'

const Div = styled.div`
    margin: 0 2em;
    font-size: 80%;
`

function NavCheckboxes() {
    const dispatch =  useDispatch()
    const state = useSelector(state => state)

    return <Div>
        {/* <CheckBox
            labelText='all'
            checked={state.all}
            handler={() => dispatch({ type: 'TOGGLE_ALL' }) }
        />
        <CheckBox
            labelText='table'
            checked={state.table}
            handler={() => dispatch({ type: 'TOGGLE_TABLE' }) }
        /> */}

        <button
            style={{
                backgroundColor: state.table ? 'red' : 'gray',
                color: 'white',
            }}
            onClick={() => dispatch({ type: 'TOGGLE_TABLE' }) }
        >table</button>
        <button
            style={{
                backgroundColor: state.all ? 'red' : 'gray',
                color: 'white',
            }}
            onClick={() => dispatch({ type: 'TOGGLE_ALL' }) }
        >all</button>
    </Div>
}

export default NavCheckboxes