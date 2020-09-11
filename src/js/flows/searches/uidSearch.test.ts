import {createZealotMock} from "zealot"

import {conn} from "../../test/mockLogs"
import {uidSearch} from "./uidSearch"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore(createZealotMock().stubStream("search", []))
})

test("dispatches request", async () => {
  let log = conn()
  await store.dispatch(uidSearch(log))
})
