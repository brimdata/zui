import * as React from "react"
import classNames from "classnames"

import DropdownArrow from "../../icons/DropdownArrow"

type Props = {
  text?: string
  icon?: React.ReactNode
  dropdown?: boolean
  disabled?: boolean
  className?: string
  isPrimary?: boolean
} & React.HTMLProps<HTMLButtonElement>

const ToolbarButton = ({
  text,
  icon,
  disabled,
  dropdown,
  className,
  isPrimary,
  ...rest
}: Props) => {
  const cn = classNames(
    "toolbar-button",
    isPrimary && "toolbar-button-primary",
    className
  )
  return (
    <button {...rest} className={cn} disabled={disabled} type="button">
      {!!icon && <span className="icon">{icon}</span>}
      {!!text && <span className="text">{text}</span>}
      {!!dropdown && <DropdownArrow />}
    </button>
  )
}

export default ToolbarButton
