import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const StyledLoading = styled.div`
    display: inline-block;
    width: 1em;
    height: 1em;
    &:after {
        content: ' ';
        display: block;
        width: 1em;
        height: 1em;
        /* margin: 8px; */
        border-radius: 50%;
        border: 6px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: ${rotate} 1.2s linear infinite;
    }
`
