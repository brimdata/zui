import styled from "styled-components"

export const TextInput = styled.input.attrs({type: "text"})`
  display: block;
  width: 100%;
  border: 1px solid #c0c0c0;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.14);
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 14px;
  line-height: 20px;
  transition: all 0.5s;

  &::placeholder {
    font-style: italic;
  }

  &:focus-visible {
    border-color: var(--primary-color);
    box-shadow: 0 1px 4px hsl(212 50% 50% / 0.25);
    outline: none;
  }
`

export default TextInput
