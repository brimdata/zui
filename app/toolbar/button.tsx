import * as React from "react"
import classNames from "classnames"

import Icon from "app/core/Icon"
import styled from "styled-components"

type Props = {
  text?: string
  icon?: React.ReactNode
  dropdown?: boolean
  disabled?: boolean
  className?: string
  isPrimary?: boolean
} & React.HTMLProps<HTMLButtonElement>

const DropdownIcon = styled(Icon)`
  width: 9px;
  height: 9px;
  display: flex;
  justify-contents: center;
  align-items: center;
  margin: 0 4px;
`

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
      {!!dropdown && <DropdownIcon name="chevron-down" />}
    </button>
  )
}

export default ToolbarButton
