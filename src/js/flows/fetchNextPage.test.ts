import {createZealotMock, zng} from "zealot"

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

const records = zng.createRecords([
  {
    id: 1,
    schema: {
      type: "record",
      of: [
        {name: "td", type: "string"},
        {name: "ts", type: "time"}
      ]
    },
    values: ["1", "100"]
  },
  {
    id: 1,
    values: ["1", "200"]
  },
  {
    id: 1,
    values: ["1", "300"]
  }
])

let store, zealot, tabId
beforeEach(() => {
  zealot = createZealotMock()
  zealot.stubStream("search", [])
  store = initTestStore(zealot.zealot)
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
  const search = jest.spyOn(zealot.zealot, "search")
  store.dispatch(fetchNextPage())

  const data = records[1].at(1)
  // This should be fixed so that all data have a value field or getValue method
  if (!("value" in data)) throw new Error("boom")

  const lastChangeTs = data.value
  expect(search).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      from: new Date(0),
      to: new Date(+lastChangeTs * 1000 + 1)
    })
  )
})

test("#fetchNextPage when there is only 1 event", () => {
  const search = jest.spyOn(zealot.zealot, "search")
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
