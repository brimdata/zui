import {createZealotMock} from "zealot"

import {fetchNextPage} from "./fetchNextPage"
import Clusters from "../state/Clusters"
import Current from "../state/Current"
import Search from "../state/Search"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import fixtures from "../test/fixtures"
import initTestStore from "../test/initTestStore"

const records = [
  [
    {name: "_td", type: "string", value: "1"},
    {name: "ts", type: "time", value: "100"}
  ],
  [
    {name: "_td", type: "string", value: "1"},
    {name: "ts", type: "time", value: "200"}
  ],
  [
    {name: "_td", type: "string", value: "1"},
    {name: "ts", type: "time", value: "300"}
  ]
]

let store, zealot, tabId
beforeEach(() => {
  zealot = createZealotMock()
  zealot.stubStream("search", [])
  store = initTestStore(zealot)
  tabId = Tabs.getActive(store.getState())
  const conn = fixtures("cluster1")
  const space = fixtures("space1")
  store.dispatchAll([
    Clusters.add(conn),
    Spaces.setDetail(conn.id, space),
    Current.setConnectionId(conn.id),
    Current.setSpaceId(space.id),
    Search.setSpanArgsFromDates([new Date(0), new Date(10 * 1000)]),
    Tab.computeSpan(),
    Viewer.appendRecords(tabId, records)
  ])
  store.clearActions()
})

test("#fetchNextPage dispatches splice", () => {
  store.dispatch(fetchNextPage())

  expect(store.getActions()).toEqual(
    expect.arrayContaining([{tabId, type: "VIEWER_SPLICE", index: 2}])
  )
})

test("#fetchNextPage adds 1ms to ts of last change", () => {
  const search = jest.spyOn(zealot, "search")
  store.dispatch(fetchNextPage())

  const lastChangeTs = records[1][1].value
  expect(search).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      from: new Date(0),
      to: new Date(+lastChangeTs * 1000 + 1)
    })
  )
})

test("#fetchNextPage when there is only 1 event", () => {
  const search = jest.spyOn(zealot, "search")
  store.dispatch(Viewer.splice(tabId, 1))
  store.dispatch(fetchNextPage())

  expect(search).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      from: new Date(0),
      to: new Date(10 * 1000)
    })
  )
})

test("#fetchNextPage does not mutate the exisiting span", () => {
  const before = [...Tab.getSpanAsDates(store.getState())]
  store.dispatch(fetchNextPage())
  const after = [...Tab.getSpanAsDates(store.getState())]

  expect(before).toEqual(after)
})
