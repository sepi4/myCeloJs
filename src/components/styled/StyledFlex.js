import styled from 'styled-components'

export const StyledRow = styled.div`
    display: flex;
    align-items: center;
    margin: ${({ margin }) => margin || '0'};
`

export const StyledColumn = styled.div`
    display: flex;
    /* height: 100%; */
    flex-direction: column;
    margin: ${({ margin }) => margin || '0'};
    justify-content: ${({ justifyContent }) => justifyContent || 'space-evenly'};
`