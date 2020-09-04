

import getTestState from "../../test/helpers/getTestState";
import migrate from "./202008031645_removeViewerSlice";

test("migrating 202008031645_removeViewerSlice", () => {
  let {
    data
  } = getTestState("v0.14.0");

  const next = migrate(data);

  const windows = Object.values(next.windows);

  for (const win of windows) {
    // $FlowFixMe
    for (const tab of win.state.tabs.data) {
      expect(tab.viewer).toBe(undefined);
      expect(tab.chart).toBe(undefined);
    }
  }
});