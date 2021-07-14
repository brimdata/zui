import {main} from "src/js/electron/main"
import initialize from "src/js/initializers/initialize"
import Current from "src/js/state/Current"
import {onPage} from "./utils"

export async function setupBrim({page}) {
  await main({backend: false})
  onPage(page)
  const {store} = await initialize()
  const select = (fn) => fn(store.getState())
  const dispatch = store.dispatch
  const navTo = (path) => select(Current.getHistory).push(path)
  return {store, select, dispatch, navTo}
}
