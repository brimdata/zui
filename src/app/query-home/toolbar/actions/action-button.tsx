import Icon, {IconName} from "src/app/core/icon-temp"
import {MenuItemConstructorOptions} from "electron/main"
import React from "react"
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
    enabled: !disabled,
  }))
}

export type ActionButtonProps = MenuItemConstructorOptions & {
  label?: string
  title?: string
  icon?: IconName | MenuItemConstructorOptions["icon"]
  disabled?: boolean
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
        onClick={() => {
          // @ts-ignore
          props.click()
        }}
        icon={<Icon name={props.icon as IconName} />}
        disabled={props.disabled}
        dropdown={!!props.submenu}
        {...props.buttonProps}
      />
      {props.label && <Label isDisabled={props.disabled}>{props.label}</Label>}
    </Wrap>
  )
}

export default ActionButton
