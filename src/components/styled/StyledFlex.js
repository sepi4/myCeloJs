import styled from 'styled-components'

export const StyledRow = styled.div`

display: inline-flex;
    display: flex;
    /* flex-wrap: wrap; */
    /* gap: 1em; */
    width: 40vw;


    /* display: flex; */
    /* gap: 1em; */

    align-items: ${({ alignItems }) => alignItems || 'center'};
    justify-content: ${({ justifyContent }) => justifyContent || 'space-evenly'};
    margin: ${({ margin }) => margin || '0'};
    font-size: 90%;
`

export const StyledColumn = styled.div`
    display: flex;
    flex-direction: column;
    margin: ${({ margin }) => margin || '0'};
    justify-content: ${({ justifyContent }) => justifyContent || 'space-evenly'};
`