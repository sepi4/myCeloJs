import { StyledContentDiv, StyledDiv } from '../styled/styledSettings'

interface Props {
    title?: string
    required?: boolean
    children?: JSX.Element | JSX.Element[]
}

function SettingsDiv(props: Props) {
    const req = props.required ? (
        <span
            style={{
                // marginLeft: '1em',
                color: 'darkred',
                fontWeight: 'bold',
                fontSize: '150%',
            }}
        >
            *
        </span>
    ) : null
    return (
        <StyledDiv>
            {props.title && (
                <div
                    style={{
                        fontWeight: 'bold',
                        fontSize: '100%',
                    }}
                >
                    {props.title} {req}
                </div>
            )}
            <StyledContentDiv>{props.children}</StyledContentDiv>
        </StyledDiv>
    )
}

export default SettingsDiv
