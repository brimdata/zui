
import { isEmpty } from "lodash";

import { Thunk } from "../state/types";
import { indexOfLastChange } from "../lib/Array";
import { viewerSearch } from "./searches/viewerSearch";
import Search from "../state/Search";
import Tabs from "../state/Tabs";
import Viewer from "../state/Viewer";
import brim from "../brim";

export const fetchNextPage = (): Thunk => (dispatch, getState) => {
  let state = getState();
  let args = Search.getArgs(state);
  let logs = Viewer.getLogs(state);
  let tabId = Tabs.getActive(state);
  let [spliceIndex, span] = nextPageArgs(logs, args.span);
  let [from, to] = span;
  dispatch(Viewer.splice(tabId, spliceIndex));
  return dispatch(viewerSearch({
    query: args.tableProgram,
    from,
    to,
    target: "events",
    append: true
  }));
};

function nextPageArgs(logs, span) {
  let spliceIndex = 0;
  let nextSpan = [...span];
  if (!isEmpty(logs)) {
    let index = indexOfLastChange(logs, log => log.getString("ts"));
    if (index >= 0) {
      const prevTs = logs[index].getField("ts").toDate();
      nextSpan[1] = brim.time(prevTs).add(1, "ms").toDate();
      spliceIndex = index + 1;
    }
  }
  return [spliceIndex, nextSpan];
}