import {createZealotMock} from "zealot"

import {response} from "../responses/mod"
import {submitSearch} from "../mod"
import Current from "../../../state/Current"
import Handlers from "../../../state/Handlers"
import SearchBar from "../../../state/SearchBar"
import Spaces from "../../../state/Spaces"
import Viewer from "../../../state/Viewer"
import fixtures from "../../../test/fixtures"
import initTestStore from "../../../test/initTestStore"

const countResp = response("count.txt")
const dnsResp = response("dns.txt")
const space = fixtures("space1")

let store, zealot, dispatch, select
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())
  zealot.stubStream("search", dnsResp)
  store.dispatchAll([
    Current.setConnectionId("1"),
    Spaces.setDetail("1", space),
    Current.setSpaceId(space.id),
    SearchBar.changeSearchBarInput("dns"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("query")
  ])
})
const submit = (...args) => dispatch(submitSearch(...args))

describe("analytic search", () => {
  beforeEach(() => {
    dispatch(SearchBar.changeSearchBarInput("_path=conn | count()"))
    zealot.stubStream("search", countResp)
  })

  test("zealot gets the right args", async () => {
    await submit()

    expect(zealot.calls("search").length).toBe(1)
    expect(zealot.calls("search")[0].args).toEqual(
      "dns _path=conn | count() | head 10000"
    )
  })

  test("the table gets populated", async () => {
    await submit()
    expect(select(Viewer.getViewerRecords)).toEqual([
      [{name: "count", type: "count", value: "8100"}]
    ])
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
})
