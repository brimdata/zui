import React from "react"
import {useDispatch} from "src/app/core/state"
import Appearance from "src/js/state/Appearance"
import {IconButton} from "src/components/icon-button"

export const SidebarToggleButton = () => {
  const dispatch = useDispatch()
  return (
    <IconButton
      iconName="sidebar-toggle"
      label="Toggle Left Sidebar"
      data-tooltip="Toggle Left Sidebar"
      iconSize={16}
      click={() => dispatch(Appearance.toggleSidebar())}
    />
  )
}

export const RightSidebarToggleButton = () => {
  const dispatch = useDispatch()
  return (
    <IconButton
      iconName="right-sidebar-toggle"
      label="Toggle Right Sidebar"
      data-tooltip="Toggle Right Sidebar"
      iconSize={16}
      click={() => dispatch(Appearance.toggleSecondarySidebar())}
    />
  )
}
