import styled from "styled-components"

const Option = styled.button`
  border: transparent;
  background: none;
  height: 100%;
  white-space: nowrap;
  padding: 0 12px;
  min-width: min-content;
  border-radius: 4px;
  transition: background 100ms;

  &:active {
    transition: none;
    background: rgba(0, 0, 0, 0.05);
  }
`

export default Option
