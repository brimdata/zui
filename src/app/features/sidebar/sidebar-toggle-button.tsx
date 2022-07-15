import React from "react"
import {useDispatch} from "src/app/core/state"
import Appearance from "src/js/state/Appearance"
import styled from "styled-components"
import Icon from "../../core/icon-temp"

const Button = styled.button`
  display: flex;
  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    transition: background-color 300ms;
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.12);
    transition: background-color 0ms;
  }
`

const SidebarToggleButton = () => {
  const dispatch = useDispatch()
  return (
    <Button onClick={() => dispatch(Appearance.toggleSidebar())}>
      <Icon size={16} name="sidebar-toggle" />
    </Button>
  )
}

export default SidebarToggleButton
