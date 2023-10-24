import {IconName} from "src/app/core/icon-temp"
import ZuiApi from "src/js/api/zui-api"
import {Menu} from "./menu"
import {BoundCommand} from "src/app/commands/command"
import {MenuItemConstructorOptions} from "electron"

export type MenuItem = {
  id?: string
  display?: "icon" | "icon-label"
  label?: string
  description?: string
  enabled?: boolean
  visible?: boolean
  iconName?: IconName
  iconSize?: number
  // Moving away from the bound command pattern
  command?: string | BoundCommand<any, any>
  args?: any[]
  nestedMenu?: Menu
  checked?: boolean
  htmlAttrs?: any
  when?: string
  whenResult?: boolean
  priority?: number
  accelerator?: MenuItemConstructorOptions["accelerator"]
  click?: () => void
}

export type MenuContext = {api: ZuiApi}

export type MenuBuilder<Args extends any[]> = (
  ctx: MenuContext,
  ...args: Args
) => MenuItem[]

export type MenuInfo = {
  id: string
  label?: string
}
