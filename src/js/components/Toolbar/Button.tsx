import * as React from "react"
import classNames from "classnames"

import DropdownArrow from "../../icons/DropdownArrow"

type Props = {
  text?: string
  icon?: React.ReactNode
  dropdown?: boolean
  disabled?: boolean
  className?: string
} & React.HTMLProps<HTMLButtonElement>

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
    <button {...rest} className={cn} disabled={disabled} type="button">
      {!!icon && <span className="icon">{icon}</span>}
      {!!text && <span className="text">{text}</span>}
      {!!dropdown && <DropdownArrow />}
    </button>
  )
}
