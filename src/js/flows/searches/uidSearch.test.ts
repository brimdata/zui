import {createZealotMock} from "zealot"

import {conn} from "../../test/mockLogs"
import {uidSearch} from "./uidSearch"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore(createZealotMock().stubStream("search", []).zealot)
})

test("dispatches request", async () => {
  const log = conn()
  await store.dispatch(uidSearch(log))
})
