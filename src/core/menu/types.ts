import {IconName} from "src/app/core/icon-temp"
import ZuiApi from "src/js/api/zui-api"
import {Menu} from "./menu"

export type MenuItem = {
  id?: string
  label?: string
  description?: string
  enabled?: boolean
  visible?: boolean
  iconName?: IconName
  iconSize?: number
  command?: string
  args?: any[]
  nestedMenu?: Menu
  checked?: boolean
  htmlAttrs?: any
  when?: string
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
