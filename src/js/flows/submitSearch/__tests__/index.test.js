/* @flow */
import {createZealotMock} from "zealot"

import {response} from "../responses/mod"
import {submitSearch} from "../mod"
import Columns from "../../../state/Columns"
import Current from "../../../state/Current"
import Handlers from "../../../state/Handlers"
import SearchBar from "../../../state/SearchBar"
import Spaces from "../../../state/Spaces"
import Viewer from "../../../state/Viewer"
import fixtures from "../../../test/fixtures"
import initTestStore from "../../../test/initTestStore"

const indexResp = response("index_search.txt")
const space = fixtures("space1")
const warningResp = response("search_warning.txt")

let store, zealot, dispatch, select
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())
  zealot.stubStream("archive.search", indexResp)
  store.dispatchAll([
    Current.setConnectionId("1"),
    Spaces.setDetail("1", space),
    Current.setSpaceId(space.id),
    SearchBar.changeSearchBarInput(":ip=192.168.0.1"),
    SearchBar.setTarget("index")
  ])
})
const submit = (...args) => dispatch(submitSearch(...args))

describe("table search", () => {
  test("zealot sends one request", async () => {
    await submit()

    const calls = zealot.calls("archive.search")
    expect(calls.length).toBe(1)
    expect(calls[0].args).toEqual(
      expect.objectContaining({patterns: [":ip=192.168.0.1"], spaceId: "1"})
    )
  })

  test("the table gets populated", async () => {
    await submit()
    expect(select(Viewer.getViewerRecords).length).toBe(4)
  })

  test("the table gets cleared", async () => {
    dispatch(
      Viewer.setRecords(undefined, [
        [{name: "clear", type: "string", value: "me"}]
      ])
    )
    submit()
    expect(select(Viewer.getViewerRecords)).toEqual([])
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

  test("search warnings", async () => {
    zealot.stubStream("archive.search", warningResp)
    await submit()
    expect(select(SearchBar.getSearchBarError)).toBe(
      "Cut field boo not present in input"
    )
  })
})
