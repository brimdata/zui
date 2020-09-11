import {useDispatch, useSelector} from "react-redux"
import React from "react"

import Button from "./Button"
import Label from "./Label"
import Layout from "../../state/Layout"
import View from "../../icons/View"
import usePopupMenu from "../hooks/usePopupMenu"

const ViewButton = () => {
  const dispatch = useDispatch()
  const leftIsOpen = useSelector(Layout.getLeftSidebarIsOpen)
  const rightIsOpen = useSelector(Layout.getRightSidebarIsOpen)

  const menu = usePopupMenu([
    {
      label: "Left Pane",
      type: "checkbox",
      checked: leftIsOpen,
      click: () => dispatch(Layout.toggleLeftSidebar())
    },
    {
      label: "Right Pane",
      type: "checkbox",
      checked: rightIsOpen,
      click: () => dispatch(Layout.toggleRightSidebar())
    }
  ])

  return (
    <div>
      <Button icon={<View />} dropdown onClick={menu.onClick} />
      <Label>View</Label>
    </div>
  )
}

export default ViewButton
