import React from "react"
import {BoundCommand} from "src/app/commands/command"
import {IconName} from "src/app/core/icon-temp"
import BrimApi from "src/js/api"
import {Menu} from "./menu"

export type MenuItem = {
  id?: string
  label?: string
  description?: string
  click?: (args: {htmlEvent?: React.MouseEvent<HTMLElement>}) => any
  enabled?: boolean
  visible?: boolean
  iconName?: IconName
  iconSize?: number
  command?: string | {id: string} | BoundCommand<any, any>
  nestedMenu?: Menu
  checked?: boolean
  htmlAttrs?: React.HTMLAttributes<HTMLElement>
}

export type MenuContext = {api: BrimApi}

export type MenuBuilder<Args extends any[]> = (
  ctx: MenuContext,
  ...args: Args
) => MenuItem[]

export type MenuInfo = {
  id: string
  label?: string
}
