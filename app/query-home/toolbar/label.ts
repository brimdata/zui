import styled from "styled-components"

const Label = styled.label<{isDisabled: boolean}>`
  ${(props) => props.theme.typography.labelSmall}
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 3px;
  color: rgba(0, 0, 0, 0.6);
  opacity: ${(p) => (p.isDisabled ? "0.5" : "1")};
`

export default Label
