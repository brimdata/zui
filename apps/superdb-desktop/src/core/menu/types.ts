import {IconName} from "src/components/icon"
import {MenuItemConstructorOptions} from "electron"
import {HandlerName} from "src/domain/messages"

export type MenuItem = {
  role?: string
  type?: string
  id?: string
  display?: "icon" | "icon-label"
  label?: string
  description?: string
  enabled?: boolean
  visible?: boolean
  iconName?: IconName
  iconSize?: number
  command?: HandlerName
  args?: any[]
  nestedMenu?: MenuItem[]
  checked?: boolean
  htmlAttrs?: any
  when?: string
  whenResult?: boolean
  priority?: number
  accelerator?: MenuItemConstructorOptions["accelerator"]
  click?: () => void
}
