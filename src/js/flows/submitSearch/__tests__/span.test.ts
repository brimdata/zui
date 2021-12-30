import tabHistory from "app/router/tab-history"
import {lakePath} from "app/router/utils/paths"
import Url from "src/js/state/Url"
import {SpanArgs} from "src/js/state/Search/types"
import {createZealotMock} from "zealot-old"
import brim from "../../../brim"
import Search from "../../../state/Search"
import SearchBar from "../../../state/SearchBar"
import Pools from "../../../state/Pools"
import Lakes from "../../../state/Lakes"
import fixtures from "../../../../../test/unit/fixtures"
import initTestStore from "../../../../../test/unit/helpers/initTestStore"
import {submitSearch} from "../mod"
import {useResponse} from "../../../../../test/shared/responses"

const dnsResp = useResponse("dns")
const countByPathResp = useResponse("countByPath")
const pool = fixtures("pool1")

let store, zealot, dispatch
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  zealot.stubStream("query", countByPathResp).stubStream("query", dnsResp)
  store.dispatchAll([
    Lakes.add({
      host: "testHost",
      id: "1",
      name: "testName",
      port: "9867",
      authType: "none"
    }),
    Pools.setDetail("1", pool),
    SearchBar.changeSearchBarInput("dns"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("query")
  ])
  store.dispatch(tabHistory.push(lakePath(pool.id, "1")))
})
const submit = (...args) => dispatch(submitSearch(...args))

test("a zoomed search", async () => {
  const zoom = brim.time.convertToSpan([new Date(0), new Date(1)])
  dispatch(Search.setSpanFocus(zoom))
  await submit()
  const {spanArgsFocus} = Url.getSearchParams(store.getState())
  expect(brim.span(spanArgsFocus as SpanArgs).toDateTuple()).toEqual([
    new Date("1970-01-01T00:00:00.000Z"),
    new Date("1970-01-01T00:00:00.001Z")
  ])
})
