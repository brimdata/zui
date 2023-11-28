import React from "react"
import {useDispatch} from "src/app/core/state"
import Appearance from "src/js/state/Appearance"
import {IconButton} from "src/components/icon-button"
import {useSelector} from "react-redux"

export const SidebarToggleButton = () => {
  const dispatch = useDispatch()
  const open = useSelector(Appearance.sidebarIsOpen)
  return (
    <IconButton
      iconName={"layout_leftbar_" + (open ? "close" : "open")}
      iconSize={16}
      click={() => dispatch(Appearance.toggleSidebar())}
    />
  )
}

export const RightSidebarToggleButton = () => {
  const dispatch = useDispatch()
  const open = useSelector(Appearance.secondarySidebarIsOpen)
  return (
    <IconButton
      iconName={"layout_rightbar_" + (open ? "close" : "open")}
      iconSize={16}
      click={() => dispatch(Appearance.toggleSecondarySidebar())}
    />
  )
}
