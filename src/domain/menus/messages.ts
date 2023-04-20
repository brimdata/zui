import {MenuItem} from "src/core/menu"

export type MenusMessages = {
  "menus.update": [name: string, id: string, props: Partial<MenuItem>]
}
