
import { createZealotMock } from "zealot";

import { response } from "../responses/mod";
import { submitSearch } from "../mod";
import Current from "../../../state/Current";
import History from "../../../state/History";
import Investigation from "../../../state/Investigation";
import Last from "../../../state/Last";
import SearchBar from "../../../state/SearchBar";
import Spaces from "../../../state/Spaces";
import fixtures from "../../../test/fixtures";
import initTestStore from "../../../test/initTestStore";

const dnsResp = response("dns.txt");
const space = fixtures("space1");

let store, zealot, dispatch, select;
beforeEach(() => {
  zealot = createZealotMock();
  store = initTestStore(zealot);
  dispatch = store.dispatch;
  select = (s: any) => s(store.getState());
  zealot.stubStream("search", dnsResp);
  store.dispatchAll([Current.setConnectionId("1"), Spaces.setDetail("1", space), Current.setSpaceId(space.id), SearchBar.changeSearchBarInput("dns"), SearchBar.pinSearchBar(), SearchBar.changeSearchBarInput("query")]);
});
const submit = (...args) => dispatch(submitSearch(...args));

test("Always saves search to last search record", async () => {
  await submit({ history: false, investigation: false });
  expect(select(Last.getSearch)).toEqual({
    pins: ["dns"],
    program: "query",
    spaceId: space.id,
    spaceName: "default",
    spanArgs: ["now - 5m", "now"],
    target: "events"
  });
});

test("saves to history", async () => {
  expect(select(History.count)).toBe(0);
  await submit();
  expect(select(History.count)).toBe(1);
});

test("does not save to history", async () => {
  expect(select(History.count)).toBe(0);
  await submit({ history: false, investigation: true });
  expect(select(History.count)).toBe(0);
});

test("saves to investigation", async () => {
  expect(select(Investigation.getInvestigation).length).toBe(0);
  await submit();
  expect(select(Investigation.getInvestigation).length).toBe(1);
});

test("does not save to investigation", async () => {
  expect(select(Investigation.getInvestigation).length).toBe(0);
  await submit({ investigation: false, history: true });
  expect(select(Investigation.getInvestigation).length).toBe(0);
});