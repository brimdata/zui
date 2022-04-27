import Icon, {IconName} from "src/app/core/icon-temp"
import {MenuItemConstructorOptions} from "electron/main"
import React, {MouseEvent} from "react"
import Button from "./button"
import Label from "./label"
import styled from "styled-components"

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
  click: (e: MouseEvent) => void
  title: string
  icon: IconName
  disabled?: boolean
  submenu?: MenuItemConstructorOptions[]
  buttonProps?: object
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 0;
`

const ActionButton = (props: ActionButtonProps) => {
  return (
    <Wrap title={props.title}>
      <Button
        aria-label={props.label}
        onClick={props.click}
        icon={<Icon name={props.icon} />}
        disabled={props.disabled}
        dropdown={!!props.submenu}
        {...props.buttonProps}
      />
      {props.label && <Label isDisabled={props.disabled}>{props.label}</Label>}
    </Wrap>
  )
}

export default ActionButton
