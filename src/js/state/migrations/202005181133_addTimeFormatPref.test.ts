

import Prefs from "../Prefs";
import getTestState from "../../test/helpers/getTestState";
import migrate from "./202005181133_addTimeFormatPref";

test("migrating 202005181133_addTimeFormatPref", () => {
  let prev = getTestState("v0.9.1");

  let next = migrate(prev);

  let timeFormat = Prefs.getTimeFormat(next.globalState);
  expect(timeFormat).toBe("");
});