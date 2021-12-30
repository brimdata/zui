import {createZealotMock} from "zealot-old"

import Lakes from "../state/Lakes"
import Current from "../state/Current"
import fixtures from "../../../test/unit/fixtures"
import deletePartialPools from "./deletePartialPools"
import initTestStore from "../../../test/unit/helpers/initTestStore"
import Handlers from "../state/Handlers"
import {lakePath} from "app/router/utils/paths"
import tabHistory from "app/router/tab-history"

const testPoolId1 = "testPoolId1"
const testPoolId2 = "testPoolId2"
const ws = fixtures("workspace1")

let store, zealot
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  store.dispatch(Lakes.add(ws))
})

test("reset current pool id if mid-ingest", async () => {
  zealot.stubPromise("pools.delete", true)
  store.dispatch(
    Handlers.register("id-1", {type: "INGEST", poolId: testPoolId1})
  )
  zealot.stubPromise("pools.delete", true)
  store.dispatch(
    Handlers.register("id-2", {type: "INGEST", poolId: testPoolId2})
  )
  store.dispatch(tabHistory.push(lakePath(testPoolId1, ws.id)))

  await store.dispatch(deletePartialPools())

  expect(zealot.calls("pools.delete")).toHaveLength(2)
  expect(Current.getPoolId(store.getState())).toEqual(null)
})

test("dont reset current id if not mid-ingest", async () => {
  zealot.stubPromise("pools.delete", true)
  store.dispatch(
    Handlers.register("id-2", {type: "INGEST", poolId: testPoolId2})
  )
  store.dispatch(tabHistory.push(lakePath(testPoolId1, ws.id)))

  await store.dispatch(deletePartialPools())

  expect(zealot.calls("pools.delete")).toHaveLength(1)
  expect(Current.getPoolId(store.getState())).toEqual(testPoolId1)
})
