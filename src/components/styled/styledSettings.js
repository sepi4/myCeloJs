import styled from 'styled-components'

export const StyledContentDiv = styled.div`
    margin: .2em 0 0 0;
    min-width: 100%;
    min-height: 1em;
    color: black;
    overflow-wrap: break-word;
`
export const StyledDiv = styled.div`
    padding: 1em;
    &:hover {
        background-color: #666;
    }
`

export const StyledTextDiv = styled.div`
    min-height: 1em;
    font-size: 90%;
    overflow-wrap: break-word;
    background-color: #999;
    padding: .3em;
    margin-bottom: .2em;
    border: solid .05em #555;
`

export const StyledButton = styled.button`
    margin: 0.2em 0;
    width: 25vw;
    color: #ddd;
    cursor: pointer;
    background-color: ${({ buttonColor }) => buttonColor || '#181818'};
    padding: .2em 0;
    font-size: 1em;
    border: 0;
    &:active {
        color: black;
        background-color: #ddd;
    }
`
