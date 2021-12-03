import {createZealotMock} from "zealot-old"

import {submitSearch} from "../mod"
import SearchBar from "../../../state/SearchBar"
import Pools from "../../../state/Pools"
import fixtures from "../../../../../test/unit/fixtures"
import initTestStore from "../../../../../test/unit/helpers/initTestStore"
import {lakePath} from "app/router/utils/paths"
import tabHistory from "app/router/tab-history"
import {useResponse} from "../../../../../test/shared/responses"

const dnsResp = useResponse("dns")
const pool = fixtures("pool1")

let store, zealot, dispatch, select
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())
  zealot.stubStream("query", dnsResp)
  store.dispatchAll([
    Pools.setDetail("1", pool),
    SearchBar.changeSearchBarInput("dns"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("query")
  ])
  store.dispatch(tabHistory.push(lakePath(pool.id, "1")))
})
const submit = (...args) => dispatch(submitSearch(...args))

test("Validates the zql", () => {
  store.dispatch(tabHistory.push(`/workspaces/1/lakes/${pool.id}/search`))
  expect(select(SearchBar.getSearchBarError)).toEqual(null)

  dispatch(SearchBar.changeSearchBarInput("_ath=="))
  submit().catch((e) => e)

  expect(select(SearchBar.getSearchBarError)).toMatch(
    /Expected [\s\S]* found\./
  )
})

test("Checks for parallel procs", () => {
  dispatch(
    SearchBar.changeSearchBarInput("files | split ( => count(); => head 1;)")
  )
  submit().catch((e) => e)
  expect(select(SearchBar.getSearchBarError)).toMatch(
    /Parallel procs are not yet supported in Brim./
  )
})
