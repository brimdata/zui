import {MenuItemConstructorOptions} from "electron"
import {Item} from "src/js/state/Queries/types"
import {createMenu} from "src/core/menu"
import {QueriesRunner} from "src/runners/queries-runner"

export const openQueryMenu = createMenu(({api}) => {
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
          click: () => new QueriesRunner().open(query.id),
        }
      }
    })
  }

  return createMenuItems(api.queries.allLocal)
})
