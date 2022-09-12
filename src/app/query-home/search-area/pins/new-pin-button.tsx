import React from "react"
import Icon from "src/app/core/icon-temp"
import {newPinMenu} from "src/app/menus/new-pin-menu"
import styled from "styled-components"

const Button = styled.button`
  border-radius: 8px;
  display: flex;
  height: 20px;
  margin: 0;
  border: none;
  margin-bottom: 4px;
  margin-right: 4px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0 6px;
  &:hover {
    background-color: var(--button-background-hover);
  }
  &:active {
    background-color: var(--button-background-active);
  }
`

export function NewPinButton() {
  return (
    <Button onClick={newPinMenu.dropdownHandler}>
      <Icon name="pin" size={12} />
      <Icon name="chevron-down" size={11} />
    </Button>
  )
}
