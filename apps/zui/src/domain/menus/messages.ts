import {MenuItem} from "src/core/menu"

export type MenusHandlers = {
  "menus.update": (name: string, id: string, props: Partial<MenuItem>) => void
}
