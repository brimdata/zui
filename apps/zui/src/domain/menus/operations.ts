import {createOperation} from "src/core/operations"
import {MenuItem, menus} from "src/zui"

export const extendMenu = createOperation(
  "menus.extend",
  (_ctx, id: string, items: MenuItem[]) => {
    for (let ext of menus.extensions) {
      if (ext.id === id) ext.callback(items)
    }
    return items
  }
)
