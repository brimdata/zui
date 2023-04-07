import {remove} from "lodash"
import {zed} from "@brimdata/zed-js"
import {MenuItemConstructorOptions} from "electron"

export type Search = (data: {
  record: zed.Record
  field: zed.Field
}) => MenuItemConstructorOptions

export type Detail = (data: {
  record: zed.Record
  field: zed.Field
}) => MenuItemConstructorOptions

export class MenusApi<T> {
  private registry: T[] = []

  constructor() {}

  add(menuItem: T) {
    this.registry.push(menuItem)
  }

  remove(menuItem: T): void {
    if (this.registry.includes(menuItem)) remove(this.registry, (l) => l === l)
  }

  list() {
    return [...this.registry]
  }
}
