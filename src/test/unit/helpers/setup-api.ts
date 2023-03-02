import ZuiApi from "src/js/api/zui-api"
import initTestStore from "./initTestStore"

export function setupApi() {
  const api = new ZuiApi()
  const store = initTestStore(api)
  api.init(store.dispatch, store.getState)
  return api
}
