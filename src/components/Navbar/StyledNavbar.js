import styled from 'styled-components'


export const StyledNavbar = styled.div`
    background-color: #181818;
    color: #ddd;
    position: fixed;
    top: 0;
    left: 0;
    height: 3em;
    width: 100%;
    border-bottom: 2px solid black;
    display: flex;
    align-items: center;
    z-index: 100;
    cursor: default;

    justify-content: ${({ justifyContent }) => justifyContent}
`