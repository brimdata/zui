import React from "react"
import {Icon} from "src/components/icon"
import styled from "styled-components"

const BG = styled.div`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 5px;
  padding: 5px 12px;
  width: 100%;
  background: var(--emphasis-bg);

  svg {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    opacity: 0.5;
  }

  &:focus-within {
    background: rgba(0, 0, 0, 0.05);
  }
`

const Input = styled.input`
  &::placeholder {
    color: var(--fg-color);
    opacity: 0.4;
  }
  height: 22px;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  &:focus {
    outline: none;
  }
`

export const SearchBar = (props: React.ComponentPropsWithRef<"input">) => {
  return (
    <BG>
      <Icon name="query" />
      <Input type="text" {...props} />
    </BG>
  )
}
