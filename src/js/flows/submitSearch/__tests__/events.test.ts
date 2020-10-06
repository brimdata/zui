import {createZealotMock, zng} from "zealot"

import {submitSearch} from "../mod"
import Chart from "../../../state/Chart"
import Columns from "../../../state/Columns"
import Current from "../../../state/Current"
import Handlers from "../../../state/Handlers"
import SearchBar from "../../../state/SearchBar"
import Spaces from "../../../state/Spaces"
import Viewer from "../../../state/Viewer"
import fixtures from "../../../test/fixtures"
import initTestStore from "../../../test/initTestStore"
import responses from "../../../test/responses"

const countByPathResp = responses("count_by_path.txt")
const dnsResp = responses("dns.txt")
const space = fixtures("space1")
const warningResp = responses("search_warning.txt")

let store, zealot, dispatch, select
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())

  store.dispatchAll([
    Current.setConnectionId("1"),
    Spaces.setDetail("1", space),
    Current.setSpaceId(space.id),
    SearchBar.changeSearchBarInput("dns"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("query")
  ])
})

const submit = (...args) => dispatch(submitSearch(...args)).catch((e) => e)

describe("table search", () => {
  beforeEach(() => {
    zealot.stubStream("search", countByPathResp).stubStream("search", dnsResp)
  })

  test("zealot gets two requests", async () => {
    await submit()

    const calls = zealot.calls("search")
    expect(calls.length).toBe(2)
    expect(calls[0].args).toEqual("dns query | every 1sec count() by _path")
    expect(calls[1].args).toEqual("dns query | head 500")
  })

  test("the table gets populated", async () => {
    await submit()
    expect(select(Viewer.getViewerRecords).length).toBe(2)
  })

  test("the table gets cleared", async () => {
    dispatch(
      Viewer.setRecords(undefined, [
        new zng.Record([{name: "clear", type: "string"}], ["me"])
      ])
    )
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

  test("registers a table request then cleans it up", async () => {
    const promise = submit()
    expect(select(Handlers.get)["Table"]).toEqual(
      expect.objectContaining({type: "SEARCH"})
    )
    await promise
    expect(select(Handlers.get)["Table"]).toBe(undefined)
  })

  test("aborts previous table request", async () => {
    const abort = jest.fn()
    dispatch(Handlers.register("Table", {type: "SEARCH", abort}))
    await submit()
    expect(abort).toHaveBeenCalledTimes(1)
  })

  test("sets the viewer columns", async () => {
    await submit()
    expect(select(Viewer.getColumns)).toMatchSnapshot()
  })

  test("sets the Columns columns", async () => {
    await submit()
    expect(select(Columns.getColumns)).toMatchSnapshot()
  })

  test("the chart status updates", async () => {
    const promise = submit()
    expect(select(Chart.getStatus)).toBe("FETCHING")
    await promise
    expect(select(Chart.getStatus)).toBe("SUCCESS")
  })

  test("registers historgram request then cleans it up", async (done) => {
    const promise = submit()
    expect(select(Handlers.get)["Histogram"]).toEqual(
      expect.objectContaining({type: "SEARCH"})
    )
    await promise
    // The promise only waits for the table, might be good to return two
    // promises so people can decide what they want to wait for.
    setTimeout(() => {
      expect(select(Handlers.get)["Histogram"]).toBe(undefined)
      done()
    })
  })

  test("aborts previous histogram request", async () => {
    const abort = jest.fn()
    dispatch(Handlers.register("Histogram", {type: "SEARCH", abort}))
    await submit()
    expect(abort).toHaveBeenCalledTimes(1)
  })

  test("populates the chart", async () => {
    await submit()
    expect(select(Chart.getData)).toMatchSnapshot()
  })
})

describe("search with warnings", () => {
  test("search warnings", async () => {
    zealot
      .stubStream("search", countByPathResp)
      .stubStream("search", warningResp)
    await submit()
    expect(select(SearchBar.getSearchBarError)).toBe(
      "Cut field boo not present in input"
    )
  })
})
