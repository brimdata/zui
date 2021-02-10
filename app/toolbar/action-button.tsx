import Icon, {IconName} from "app/core/Icon"
import React from "react"
import Label from "./label"
import Button from "./button"
import {MenuItemConstructorOptions} from "electron/main"

export function toMenu(
  actions: ActionButtonProps[]
): MenuItemConstructorOptions[] {
  return actions.map(({label, click, submenu, disabled}) => ({
    label,
    click,
    submenu,
    enabled: !disabled
  }))
}

export type ActionButtonProps = {
  label: string
  click: () => void
  title: string
  icon: IconName
  disabled?: boolean
  submenu?: MenuItemConstructorOptions[]
  buttonProps?: object
}

const ActionButton = (props: ActionButtonProps) => {
  return (
    <div title={props.title}>
      <Button
        onClick={props.click}
        icon={<Icon name={props.icon} />}
        disabled={props.disabled}
        dropdown={!!props.submenu}
        {...props.buttonProps}
      />
      {props.label && <Label>{props.label}</Label>}
    </div>
  )
}

export default ActionButton
