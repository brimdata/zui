import styled from "styled-components"

export const HeadingButton = styled.button`
  background: white;
  border: none;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 0 6px 0 10px;
  gap: 4px;

  &:hover {
    background: var(--button-background);
    * {
      opacity: 1;
    }
  }
  &:active {
    background: var(--button-background-active);
  }
`
