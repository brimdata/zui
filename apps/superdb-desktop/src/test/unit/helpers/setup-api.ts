import ZuiApi from "src/js/api/zui-api"
import initTestStore from "./initTestStore"

export async function setupApi() {
  const api = new ZuiApi()
  const store = await initTestStore()
  api.init(store.dispatch, store.getState)
  return api
}
