/* @flow */
import classNames from "classnames"

import * as React from "React"

import type {$Menu} from "../electron/menu"
import DropdownArrow from "../icons/DropdownArrow"
import usePopupMenu from "./hooks/usePopupMenu"

type Props = {
  label?: string,
  icon?: React.Node,
  menu?: $Menu,
  name?: string,
  onClick?: Function
}

export default function ToolBarButton({
  label,
  icon,
  menu,
  name,
  onClick,
  ...rest
}: Props) {
  let hasIcon = !!icon
  let hasLabel = !!label
  let hasMenu = !!menu
  let hasName = !!name
  let [openMenu, isOpen] = usePopupMenu(menu || [])

  function _onClick(e) {
    onClick && onClick(e)
    hasMenu && openMenu(e.currentTarget)
  }

  return (
    <div className="tool-bar-button-wrapper">
      <button
        {...rest}
        onClick={_onClick}
        className={classNames("tool-bar-button", {
          open: isOpen,
          icon: hasIcon,
          label: hasLabel,
          menu: hasMenu
        })}
      >
        {hasIcon && <span className="icon">{icon}</span>}
        {hasLabel && <span className="label">{label}</span>}
        {hasMenu && <DropdownArrow />}
      </button>
      {hasName && <label>{name}</label>}
    </div>
  )
}
