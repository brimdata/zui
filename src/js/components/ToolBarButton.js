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
  onClick?: Function,
  className?: string,
  disabled: boolean
}

export default function ToolBarButton({
  label,
  icon,
  menu,
  name,
  onClick,
  className,
  disabled,
  ...rest
}: Props) {
  let openMenu = usePopupMenu(menu || [])

  function _onClick(e) {
    onClick && onClick(e)
    !!menu && openMenu(e.currentTarget)
  }

  return (
    <div
      className={classNames("tool-bar-button-wrapper", className, {disabled})}
    >
      <button
        onClick={_onClick}
        className="tool-bar-button"
        disabled={disabled}
        {...rest}
      >
        {!!icon && <span className="icon">{icon}</span>}
        {!!label && <span className="label">{label}</span>}
        {!!menu && <DropdownArrow />}
      </button>
      {!!name && <label>{name}</label>}
    </div>
  )
}
