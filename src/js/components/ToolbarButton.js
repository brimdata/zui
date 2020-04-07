/* @flow */
import classNames from "classnames"

import * as React from "react"

import DropdownArrow from "../icons/DropdownArrow"

type Props = {
  text?: string,
  icon?: React.Node,
  dropdown?: boolean,
  disabled?: boolean,
  className?: string
}

export default function ToolbarButton({
  text,
  icon,
  disabled,
  dropdown,
  className,
  ...rest
}: Props) {
  let cn = classNames("toolbar-button", className)
  return (
    <button className={cn} disabled={disabled} {...rest}>
      {!!icon && <span className="icon">{icon}</span>}
      {!!text && <span className="text">{text}</span>}
      {!!dropdown && <DropdownArrow />}
    </button>
  )
}
