import {MenuItemConstructorOptions} from "electron"
import {useDispatch, useSelector} from "react-redux"
import {showContextMenu} from "src/js/lib/System"
import Appearance from "src/js/state/Appearance"
import Layout from "src/js/state/Layout"
import {ActionButtonProps} from "../action-button"

export default function useView(): ActionButtonProps {
  const dispatch = useDispatch()
  const leftIsOpen = useSelector(Appearance.sidebarIsOpen)
  const rightIsOpen = useSelector(Layout.getRightSidebarIsOpen)
  const submenu = [
    {
      label: "Left Pane",
      type: "checkbox",
      checked: leftIsOpen,
      click: () => dispatch(Appearance.toggleSidebar())
    },
    {
      label: "Right Pane",
      type: "checkbox",
      checked: rightIsOpen,
      click: () => dispatch(Layout.toggleDetailPane())
    }
  ] as MenuItemConstructorOptions[]

  return {
    label: "View",
    title: "Show or hide application panes",
    icon: "view",
    submenu,
    click() {
      showContextMenu(submenu)
    }
  }
}
