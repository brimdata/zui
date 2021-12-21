import tabHistory from "app/router/tab-history"
import {lakePath} from "app/router/utils/paths"
import {createZealotMock} from "zealot-old"
import brim from "../../brim"
import fixtures from "../../../../test/unit/fixtures"
import initTestStore from "../../../../test/unit/helpers/initTestStore"
import Pools from "../Pools"
import Tab from "../Tab"
import Workspaces from "../Lakes"
import Search from "./"

const ts1 = {sec: 1, ns: 0}
const ts3 = {sec: 3, ns: 2}
const ts4 = {sec: 4, ns: 3}

describe("reducer", () => {
  let store
  const ws = fixtures("workspace1")
  const pool = brim.pool(fixtures("pool1"))

  beforeEach(() => {
    store = initTestStore(createZealotMock().stubStream("query", []).zealot)

    store.dispatchAll([Workspaces.add(ws), Pools.setDetail(ws.id, pool)])

    store.dispatch(tabHistory.push(lakePath(pool.id, ws.id)))
  })

  test("get span looks at the url", () => {
    expect(Tab.getSpan(store.getState())).toEqual(pool.everythingSpan())
  })

  test("set span focus", () => {
    const state = store.dispatchAll([Search.setSpanFocus([ts3, ts4])])
    expect(Tab.getSpanFocus(state)).toEqual([ts3, ts4])
  })

  test("set span focus to null", () => {
    const state = store.dispatchAll([Search.setSpanFocus(null)])
    expect(Tab.getSpanFocus(state)).toEqual(null)
  })

  test("set span args", () => {
    const state = store.dispatchAll([Search.setSpanArgs([ts1, "now"])])
    expect(Tab.getSpanArgs(state)).toEqual([ts1, "now"])
  })
})
