import React from "react"
import {useDispatch} from "src/app/core/state"
import Appearance from "src/js/state/Appearance"
import {IconButton} from "src/components/icon-button"
import {useSelector} from "react-redux"

export const SidebarToggleButton = () => {
  const dispatch = useDispatch()
  const open = useSelector(Appearance.sidebarIsOpen)
  const name = open ? "layout_leftbar_close" : "layout_leftbar_open"
  return (
    <IconButton
      iconName={name}
      label="Toggle Left Sidebar"
      data-tooltip="Toggle Left Sidebar"
      iconSize={16}
      click={() => dispatch(Appearance.toggleSidebar())}
    />
  )
}

export const RightSidebarToggleButton = () => {
  const dispatch = useDispatch()
  const open = useSelector(Appearance.secondarySidebarIsOpen)
  const name = open ? "layout_rightbar_close" : "layout_rightbar_open"
  return (
    <IconButton
      iconName={name}
      label="Toggle Right Sidebar"
      data-tooltip="Toggle Right Sidebar"
      iconSize={16}
      click={() => dispatch(Appearance.toggleSecondarySidebar())}
    />
  )
}
