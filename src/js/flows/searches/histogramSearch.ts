

import { Thunk } from "../../state/types";
import { createSearchEntry } from "../../brim/searchEntry";
import { search } from "../search/mod";
import Current from "../../state/Current";
import ErrorFactory from "../../models/ErrorFactory";
import Last from "../../state/Last";
import Notice from "../../state/Notice";
import Search from "../../state/Search";
import Tabs from "../../state/Tabs";
import chart from "../../state/Chart";

type Args = {
  query: string;
  from: Date;
  to: Date;
};

const id = "Histogram";

export function histogramSearch({
  query,
  from,
  to
}: Args): Thunk {
  return (dispatch, getState) => {
    const state = getState();

    const spaceId = Current.mustGetSpace(state).id;
    const {
      response,
      promise
    } = dispatch(search({ id, query, from, to, spaceId, target: "events" }));
    dispatch(handle(response));
    return promise;
  };
}

function handle(response: any): Thunk {
  return function (dispatch, getState) {
    const tabId = Tabs.getActive(getState());
    const current = Search.getCurrentRecord(getState());
    const previous = Last.getSearch(getState());

    if (shouldClear(current, previous)) dispatch(chart.clear(tabId));
    dispatch(chart.setStatus(tabId, "FETCHING"));

    response.status(status => dispatch(chart.setStatus(tabId, status))).chan(0, records => dispatch(chart.appendRecords(tabId, records))).error(error => dispatch(Notice.set(ErrorFactory.create(error))));
  };
}

function shouldClear(curr, prev) {
  if (!prev) return true;

  const a = createSearchEntry(curr);
  const b = createSearchEntry(prev);

  if (a.program === b.program && a.spaceId === b.spaceId && a.getDuration() === b.getDuration()) {
    return false;
  } else {
    return true;
  }
}