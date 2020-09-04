

import getTestState from "../../test/helpers/getTestState";
import migrate from "./202005181140_searchStateSpaceId";


const getWinStates = sess => Object.values(sess.windows).map(w => w.state);
const getTabs = state => state.tabs.data;
const getNameId = tab => [tab.search.spaceName, tab.search.spaceId];

test("migrating 202005181140_searchStateSpaceId", () => {
  let prev = getTestState("v0.9.1");
  expect(getWinStates(prev).length).toBe(1);

  let next = migrate(prev);
  expect(getWinStates(next).length).toBe(1);

  for (let state of getWinStates(next)) {
    let tabs = getTabs(state);

    // Check that it removes the old key
    for (let tab of tabs) expect(tab.search.space).toBe(undefined);

    // Check each tab for the expected migration
    expect(getNameId(tabs[0])).toEqual(["", ""]);
    expect(getNameId(tabs[1])).toEqual(["pcaps.brim", "pcaps.brim"]);
    expect(getNameId(tabs[2])).toEqual(["", ""]);
  }
});