import {InputButton} from "./input-button"
import styled from "styled-components"

export const SubmitButton = styled(InputButton).attrs({type: "submit"})`
  color: white;
  background: var(--primary-color);
  box-shadow: 0 1px 4px hsl(212 50% 50% / 0.15);
  border-color: var(--primary-color-darker);
  font-weight: 500;
  width: min-content;
  display: flex;
  user-select: none;
  line-height: 1;
  align-items: center;

  &:active {
    background-color: var(--primary-color-darker);
  }
  &:disabled {
    opacity: 0.5;
  }
`
