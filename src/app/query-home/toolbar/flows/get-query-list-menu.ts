import {MenuItemConstructorOptions} from "electron"
import Queries from "src/js/state/Queries"

const getQueryListMenu =
  () =>
  (dispatch, getState, {api}) => {
    const state = getState()
    const queries = Queries.raw(state)

    function createMenuItems(items) {
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

    return createMenuItems(queries.items)
  }

export default getQueryListMenu
