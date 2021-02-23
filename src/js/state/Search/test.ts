import {createZealotMock} from "zealot"

import Workspaces from "../Workspaces"
import Current from "../Current"
import Search from "./"
import Spaces from "../Spaces"
import Tab from "../Tab"
import brim from "../../brim"
import fixtures from "../../test/fixtures"
import initTestStore from "../../test/initTestStore"
import {lakePath} from "app/router/utils/paths"

const ts1 = {sec: 1, ns: 0}
const ts2 = {sec: 2, ns: 1}
const ts3 = {sec: 3, ns: 2}
const ts4 = {sec: 4, ns: 3}

describe("reducer", () => {
  let store

  beforeEach(() => {
    store = initTestStore(createZealotMock().stubStream("search", []).zealot)
    const ws = fixtures("workspace1")
    const space = fixtures("space1")

    store.dispatchAll([
      Workspaces.add(ws),
      Spaces.setDetail(ws.id, space),
      Current.setWorkspaceId(ws.id),
      Current.setSpaceId(space.id)
    ])

    global.tabHistory.push(lakePath(space.id, ws.id))
  })

  test("set span", () => {
    const state = store.dispatchAll([Search.setSpan([ts1, ts2])])
    expect(Tab.getSpan(state)).toEqual([ts1, ts2])
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

  test("compute span", () => {
    const now = new Date(2000, 3, 12, 12, 30)
    const state = store.dispatchAll([
      Search.setSpanArgs(["now - 5m", "now"]),
      Tab.computeSpan(now)
    ])
    const from = brim
      .time(now)
      .subtract(5, "minutes")
      .toTs()
    const to = brim.time(now).toTs()

    expect(Tab.getSpan(state)).toEqual([from, to])
  })
})

describe("selectors", () => {
  let store

  beforeEach(() => {
    store = initTestStore()
    const ws = fixtures("workspace1")
    const space = fixtures("space1")

    store.dispatchAll([
      Workspaces.add(ws),
      Spaces.setDetail(ws.id, space),
      Current.setWorkspaceId(ws.id),
      Current.setSpaceId(space.id)
    ])
    global.tabHistory.push(lakePath(space.id, ws.id))
  })

  test("getArgs", () => {
    const state = store.getState()

    expect(Search.getArgs(state)).toEqual({
      chartProgram: "* | every 1s count() by _path",
      spaceId: "1",
      spaceName: "default",
      span: [new Date(0), new Date(1000)],
      tableProgram: "* | head 500",
      type: "events"
    })
  })
})
