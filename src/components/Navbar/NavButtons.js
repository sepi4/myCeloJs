import React from 'react'
import styled from 'styled-components'

import NavButton from './NavButton'

const Div = styled.div`
    margin: 0 1em;
    font-size: 80%;
    display: flex;
    justify-content: flex-start;
    width: 100%;
`

function NavButtons() {
    return <Div>
        <NavButton text='all' />
        <NavButton text='table' />
    </Div>
}

export default NavButtons