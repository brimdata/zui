import React from "react"
import {useDispatch} from "src/app/core/state"
import Appearance from "src/js/state/Appearance"
import styled from "styled-components"
import Icon from "../../core/icon-temp"

const StyledButton = styled.button`
  display: flex;
  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
`

const SidebarToggleIcon = styled(Icon).attrs({name: "sidebar-toggle"})`
  width: 16px;
  &:hover {
    svg path {
      opacity: 0.5;
    }
  }
`

const SidebarToggleButton = () => {
  const dispatch = useDispatch()
  return (
    <StyledButton onClick={() => dispatch(Appearance.toggleSidebar())}>
      <SidebarToggleIcon />
    </StyledButton>
  )
}

export default SidebarToggleButton
