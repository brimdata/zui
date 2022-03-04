import Icon, {IconName} from "src/app/core/icon"
import {MenuItemConstructorOptions} from "electron/main"
import React from "react"
import Button from "./button"
import Label from "./label"

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
        aria-label={props.label}
        onClick={props.click}
        icon={<Icon name={props.icon} />}
        disabled={props.disabled}
        dropdown={!!props.submenu}
        {...props.buttonProps}
      />
      {props.label && <Label isDisabled={props.disabled}>{props.label}</Label>}
    </div>
  )
}

export default ActionButton
