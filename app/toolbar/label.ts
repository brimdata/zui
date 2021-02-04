import styled from "styled-components"

const Label = styled.label`
  ${(props) => props.theme.typography.labelSmall}
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 3px;
  color: var(--aqua);
`

export default Label
