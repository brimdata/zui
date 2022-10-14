import {MenuItemConstructorOptions} from "electron"
import {Item} from "src/js/state/Queries/types"
import {createMenu} from "./create-menu"

export const openQueryMenu = createMenu("openQueryMenu", ({api}) => {
  function createMenuItems(items: Item[]) {
    return items.map((query) => {
      if ("items" in query) {
        return {
          label: query.name,
          submenu: createMenuItems(query.items),
        } as MenuItemConstructorOptions
      } else {
        return {
          label: query.name,
          click: () => api.queries.open(query.id),
        }
      }
    })
  }

  return createMenuItems(api.queries.allLocal)
})
