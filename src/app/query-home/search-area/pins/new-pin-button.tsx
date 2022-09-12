import React from "react"
import Icon from "src/app/core/icon-temp"
import {newPinMenu} from "src/app/menus/new-pin-menu"
import styled from "styled-components"

const Button = styled.button`
  border-radius: 6px;
  display: flex;
  height: 20px;
  width: 34px;
  border: none;
  margin: 0;
  margin-bottom: 4px;
  margin-right: 8px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
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
