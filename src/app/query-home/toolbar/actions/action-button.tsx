import Icon, {IconName} from "src/app/core/icon-temp"
import {MenuItemConstructorOptions} from "electron/main"
import React, {MouseEvent} from "react"
import Button from "./button"
import Label from "./label"
import styled from "styled-components"
import {MenuItem} from "src/core/menu"

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
  showLabel?: boolean
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 0;
`

const ActionButton = (props: MenuItem) => {
  return (
    <Wrap title={props.description}>
      <Button
        aria-label={props.label}
        onClick={(htmlEvent: MouseEvent<HTMLElement>) =>
          props.click({htmlEvent})
        }
        icon={<Icon name={props.iconName} />}
        disabled={props.enabled === false}
        dropdown={!!props.nestedMenu}
        {...props.htmlAttrs}
      />
      {props.label && (
        <Label isDisabled={props.enabled === false}>{props.label}</Label>
      )}
    </Wrap>
  )
}

export default ActionButton
