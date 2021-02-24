import {createZealotMock} from "zealot"

import {submitSearch} from "../mod"
import Search from "../../../state/Search"
import SearchBar from "../../../state/SearchBar"
import Spaces from "../../../state/Spaces"
import Tab from "../../../state/Tab"
import brim from "../../../brim"
import fixtures from "../../../test/fixtures"
import responses from "../../../test/responses"
import initTestStore from "../../../test/initTestStore"
import Workspaces from "../../../state/Workspaces"
import {lakePath} from "app/router/utils/paths"
import {getSearchParams} from "app/router/hooks/use-search-params"
import {SpanArgs} from "src/js/state/Search/types"

const dnsResp = responses("dns.txt")
const countByPathResp = responses("count_by_path.txt")
const space = fixtures("space1")

let store, zealot, dispatch, select
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())
  zealot.stubStream("search", countByPathResp).stubStream("search", dnsResp)
  store.dispatchAll([
    Workspaces.add({
      host: "testHost",
      id: "1",
      name: "testName",
      port: "9867",
      authType: "none"
    }),
    Spaces.setDetail("1", space),
    SearchBar.changeSearchBarInput("dns"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("query")
  ])
  global.tabHistory.push(lakePath(space.id, "1"))
})
const submit = (...args) => dispatch(submitSearch(...args))

test("Computes the span", async () => {
  expect(select(Tab.getSpan)).toEqual([
    {sec: 0, ns: 0},
    {sec: 1, ns: 0}
  ])
  const now = new Date(2020, 4, 21, 12, 5, 0, 0)
  await submit(undefined, now)
  expect(select(Tab.getSpan)).toEqual([
    {ns: 0, sec: 1590087600},
    {ns: 0, sec: 1590087900}
  ])
})

test("a zoomed search", async () => {
  const zoom = brim.time.convertToSpan([new Date(0), new Date(1)])
  dispatch(Search.setSpanFocus(zoom))
  await submit()
  const {spanArgsFocus} = getSearchParams()
  expect(brim.span(spanArgsFocus as SpanArgs).toDateTuple()).toEqual([
    new Date("1970-01-01T00:00:00.000Z"),
    new Date("1970-01-01T00:00:00.001Z")
  ])
})
