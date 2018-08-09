import * as actionHistory from "./actionHistory"
import browserHistoryMiddleware from "./browserHistoryMiddleware"
import * as selectors from "./selectors"
import {initTestStore} from "./initStore"

let store

beforeEach(() => {
  store = initTestStore(actionHistory.middleware, browserHistoryMiddleware)
})

test("window onpopstate", () => {
  window.onpopstate({
    state: selectors.getBrowserHistoryState(store.getState())
  })
})
