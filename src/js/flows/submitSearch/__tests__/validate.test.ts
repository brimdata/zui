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
    Current.setConnectionId("1"),
    Spaces.setDetail("1", space),
    Current.setSpaceId(space.id),
    SearchBar.changeSearchBarInput("dns"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("query")
  ])
})
const submit = (...args) => dispatch(submitSearch(...args))

test("Validates the zql", () => {
  expect(select(SearchBar.getSearchBarError)).toEqual(null)

  dispatch(SearchBar.changeSearchBarInput("_ath="))
  submit().catch((e) => e)

  expect(select(SearchBar.getSearchBarError)).toMatch(
    /Expected [\s\S]* but end of input found\./
  )
})
