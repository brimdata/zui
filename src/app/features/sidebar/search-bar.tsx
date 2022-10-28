import React from "react"
import Icon from "src/app/core/icon-temp"
import styled from "styled-components"

const BG = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: none;
  background: rgba(0, 0, 0, 0.07);
  padding: 2px 12px;
  width: 100%;

  svg {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    opacity: 0.5;
  }
`

const Input = styled.input`
  &::placeholder {
    color: var(--foreground-color);
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
