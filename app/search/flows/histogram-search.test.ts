/**
 * @jest-environment jsdom
 */

import tabHistory from "app/router/tab-history"
import {lakePath} from "app/router/utils/paths"
import Chart from "src/js/state/Chart"
import Pools from "src/js/state/Pools"
import Lakes from "src/js/state/Lakes"
import fixtures from "test/unit/fixtures"
import initTestStore from "test/unit/helpers/initTestStore"
import {useResponse} from "test/shared/responses"
import {createZealotMock} from "zealot-old"
import {histogramSearch} from "./histogram-search"

const countByPathResp = useResponse("everyCountByPath")
const pool = fixtures("pool1")

let store, zealot, dispatch, select
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())

  store.dispatchAll([
    Lakes.add({
      host: "testHost",
      id: "1",
      name: "testName",
      port: "9867",
      authType: "none"
    }),
    Pools.setDetail("1", pool)
  ])
  store.dispatch(tabHistory.push(lakePath(pool.id, "1")))
  zealot.stubStream("query", countByPathResp)
})

const submit = () => dispatch(histogramSearch())

test("zealot gets the request", async () => {
  await submit()
  const calls = zealot.calls("query")
  expect(calls.length).toBe(1)
  expect(calls[0].args).toEqual(
    "from '1' | ts >= 2015-03-05T14:15:00.000Z | ts <= 2015-04-13T09:36:33.751Z | * | count() by every(12h), _path"
  )
})

test("the chart status updates", async () => {
  const promise = submit()
  expect(select(Chart.getStatus)).toBe("FETCHING")
  await promise
  expect(select(Chart.getStatus)).toBe("SUCCESS")
})

test("populates the chart", async () => {
  await submit()
  expect(select(Chart.getData)).toMatchSnapshot()
})
