import {createZealotMock} from "zealot"

import {submitSearch} from "../mod"
import Current from "../../../state/Current"
import SearchBar from "../../../state/SearchBar"
import Spaces from "../../../state/Spaces"
import fixtures from "../../../test/fixtures"
import initTestStore from "../../../test/initTestStore"
import responses from "../../../test/responses"

const dnsResp = responses("dns.txt")
const space = fixtures("space1")

let store, zealot, dispatch, select
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  select = (s: any) => s(store.getState())
  zealot.stubStream("search", dnsResp)
  store.dispatchAll([
    Current.setWorkspaceId("1"),
    Spaces.setDetail("1", space),
    Current.setSpaceId(space.id),
    SearchBar.changeSearchBarInput("dns"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("query")
  ])
})
const submit = (...args) => dispatch(submitSearch(...args))

test("Validates the zql", () => {
  global.tabHistory.push(`/workspaces/1/lakes/${space.id}/search`)
  expect(select(SearchBar.getSearchBarError)).toEqual(null)

  dispatch(SearchBar.changeSearchBarInput("_ath="))
  submit().catch((e) => e)

  expect(select(SearchBar.getSearchBarError)).toMatch(
    /Expected [\s\S]* but end of input found\./
  )
})

test("Checks for parallel procs", () => {
  dispatch(
    SearchBar.changeSearchBarInput("files | split ( => count() => head 1)")
  )
  submit().catch((e) => e)
  expect(select(SearchBar.getSearchBarError)).toMatch(
    /Parallel procs are not yet supported in Brim./
  )
})
