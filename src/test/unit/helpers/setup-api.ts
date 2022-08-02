import BrimApi from "src/js/api"
import initTestStore from "./initTestStore"

export function setupApi() {
  const api = new BrimApi()
  const store = initTestStore(api)
  api.init(store.dispatch, store.getState)
  return api
}
