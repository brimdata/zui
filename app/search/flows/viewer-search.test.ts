import tabHistory from "app/router/tab-history"
import {lakePath} from "app/router/utils/paths"
import Columns from "src/js/state/Columns"
import SearchBar from "src/js/state/SearchBar"
import Pools from "src/js/state/Pools"
import Viewer from "src/js/state/Viewer"
import Workspaces from "src/js/state/Workspaces"
import fixtures from "test/unit/fixtures"
import initTestStore, {TestStore} from "test/unit/helpers/initTestStore"
import {createRecord} from "test/shared/factories/zed-factory"
import {useResponse} from "test/shared/responses"
import {createZealotMock, ZealotMock} from "zealot-old"
import {viewerSearch} from "./viewer-search"

const dnsResp = useResponse("dns")
const pool = fixtures("pool1")
const warningResp = useResponse("searchWarning")

let dispatch, select
let zealot: ZealotMock
let store: TestStore
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())

  store.dispatchAll([
    Workspaces.add({
      host: "testHost",
      id: "1",
      name: "testName",
      port: "9867",
      authType: "none"
    }),
    Pools.setDetail("1", pool)
  ])
  store.dispatch(tabHistory.push(lakePath(pool.id, "1")))
})

const getQueryCallChecker = () => {
  let callCount = 0
  return async (query: string, expectAnnotation = false) => {
    zealot.stubStream("query", dnsResp)
    await dispatch(
      viewerSearch({
        query,
        from,
        to
      })
    )
    callCount++
    const calls = zealot.calls("query")
    expect(calls.length).toBe(callCount)
    const expected = expectAnnotation
      ? `from '1' | ts >= ${from.toISOString()} | ts <= 1970-01-01T00:00:00.001Z | ${query}`
      : query
    expect(calls[callCount - 1].args).toEqual(expected)
  }
}

const from = new Date()
const to = new Date(1)
const submit = () =>
  dispatch(
    viewerSearch({
      query: "dns query | head 500",
      from,
      to
    })
  )

describe("a normal response", () => {
  beforeEach(() => {
    zealot.stubStream("query", dnsResp)
  })

  test("zealot gets the request", async () => {
    const checkQueryCall = getQueryCallChecker()
    await checkQueryCall("dns query | head 500", true)
  })

  test("zealot does not annotate requests beginning with variations of 'from'", async () => {
    const checkQueryCall = getQueryCallChecker()
    await checkQueryCall("from 'test' | test")
    await checkQueryCall("from('test') | test")
    await checkQueryCall("from ('test') | test")
    await checkQueryCall("from    ('test') | test")
  })

  test("the table gets populated", async () => {
    await submit()
    expect(select(Viewer.getViewerRecords).length).toBe(2)
  })

  test("the table gets cleared", async () => {
    dispatch(Viewer.setRecords(undefined, [createRecord({clear: "me"})]))
    await submit()
    expect(select(Viewer.getViewerRecords)[0]).not.toEqual([
      {name: "clear", type: "string", value: "me"}
    ])
  })

  test("the table status updates", async () => {
    const promise = submit()
    expect(select(Viewer.getStatus)).toBe("FETCHING")
    expect(select(Viewer.getEndStatus)).toBe("FETCHING")
    await promise
    expect(select(Viewer.getStatus)).toBe("SUCCESS")
    expect(select(Viewer.getEndStatus)).toBe("COMPLETE")
  })

  test("sets the viewer columns", async () => {
    await submit()
    expect(select(Viewer.getColumns)).toMatchSnapshot()
  })

  test("sets the Columns columns", async () => {
    await submit()
    expect(select(Columns.getColumns)).toMatchSnapshot()
  })
})

test("a response with a warning", async () => {
  zealot.stubStream("query", warningResp)
  await submit()
  expect(select(SearchBar.getSearchBarError)).toBe(
    "Sort field boo not present in input"
  )
})
