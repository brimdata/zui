import styled from "styled-components"

export const HeadingButton = styled.button`
  background: white;
  border: none;
  height: 22px;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 0 6px;
  min-width: 0;
  margin-left: 10px;
  margin-right: 10px;

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
