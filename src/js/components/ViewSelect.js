/* @flow */

import React from "react"

import ToolbarButton from "./ToolbarButton"
import {useDispatch, useSelector} from "react-redux"
import Layout from "../state/Layout"
import usePopupMenu from "./hooks/usePopupMenu"
import View from "../icons/View"

const ViewSelect = () => {
  const dispatch = useDispatch()
  const leftIsOpen = useSelector(Layout.getLeftSidebarIsOpen)
  const rightIsOpen = useSelector(Layout.getRightSidebarIsOpen)

  const template = [
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
  ]

  const openMenu = usePopupMenu(template)

  const onClick = (e) => {
    openMenu(e.currentTarget)
  }

  return (
    <div>
      <ToolbarButton icon={<View />} dropdown onClick={onClick} />
      <label>View</label>
    </div>
  )
}

export default ViewSelect
