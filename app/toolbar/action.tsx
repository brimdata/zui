import Icon, {IconName} from "app/core/Icon"
import React from "react"
import Label from "./label"
import Button from "./button"
import {MenuItemConstructorOptions} from "electron/main"

export type ToolbarActionProps = {
  label: string
  click: () => void
  title: string
  icon: IconName
  disabled?: boolean
  submenu?: MenuItemConstructorOptions[]
  buttonProps?: object
}

const Action = ({
  label,
  click,
  title,
  icon,
  disabled,
  submenu,
  buttonProps
}: ToolbarActionProps) => {
  return (
    <div title={title}>
      <Button
        onClick={click}
        icon={<Icon name={icon} />}
        disabled={disabled}
        dropdown={!!submenu}
        {...buttonProps}
      />
      {label && <Label>{label}</Label>}
    </div>
  )
}

export default Action
