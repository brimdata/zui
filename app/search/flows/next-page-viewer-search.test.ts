import tabHistory from "app/router/tab-history"
import {lakeSearchPath} from "app/router/utils/paths"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import Search from "src/js/state/Search"
import Spaces from "src/js/state/Spaces"
import Tab from "src/js/state/Tab"
import Tabs from "src/js/state/Tabs"
import Viewer from "src/js/state/Viewer"
import Workspaces from "src/js/state/Workspaces"
import fixtures from "src/js/test/fixtures"
import initTestStore from "src/js/test/initTestStore"
import {createRecord} from "test/factories/zed-factory"
import {createZealotMock} from "zealot"
import {zed} from "zealot"
import nextPageViewerSearch from "./next-page-viewer-search"

const records = [
  createRecord({td: "1", ts: new Date(100)}),
  createRecord({td: "1", ts: new Date(200)}),
  createRecord({td: "1", ts: new Date(300)})
]

let store, zealot, tabId
beforeEach(() => {
  zealot = createZealotMock()
  zealot.stubStream("search", [])
  store = initTestStore(zealot.zealot)
  tabId = Tabs.getActive(store.getState())
  const ws = fixtures("workspace1")
  const space = fixtures("space1")
  store.dispatch(tabHistory.push(lakeSearchPath(space.id, ws.id)))
  store.dispatchAll([
    Workspaces.add(ws),
    Spaces.setDetail(ws.id, space),
    Search.setSpanArgsFromDates([new Date(0), new Date(10 * 1000)]),
    submitSearch(),
    Viewer.appendRecords(tabId, records)
  ])
  store.clearActions()
})

test("#fetchNextPage dispatches splice", () => {
  store.dispatch(nextPageViewerSearch())

  expect(store.getActions()).toEqual(
    expect.arrayContaining([{tabId, type: "VIEWER_SPLICE", index: 2}])
  )
})

test("#fetchNextPage adds 1ms to ts of last change", () => {
  const search = jest.spyOn(zealot.zealot, "search")
  store.dispatch(nextPageViewerSearch())

  const data = records[1].at(1) as zed.Primitive
  const lastChangeTs = data.toDate().getTime()
  expect(search).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      from: new Date(0),
      to: new Date(lastChangeTs + 1)
    })
  )
})

test("#fetchNextPage when there is only 1 event", () => {
  const search = jest.spyOn(zealot.zealot, "search")
  store.dispatch(Viewer.splice(tabId, 1))
  store.dispatch(nextPageViewerSearch())

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
  store.dispatch(nextPageViewerSearch())
  const after = [...Tab.getSpanAsDates(store.getState())]

  expect(before).toEqual(after)
})
