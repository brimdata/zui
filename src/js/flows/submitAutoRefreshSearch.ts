
import { Thunk } from "../state/types";
import { histogramSearch } from "./searches/histogramSearch";
import { viewerSearch } from "./searches/viewerSearch";
import Search from "../state/Search";

export default function submitAutoRefreshSearch(): Thunk {
  return function (dispatch, getState) {
    const {
      chartProgram,
      tableProgram,
      span
    } = Search.getArgs(getState());
    const [from, to] = span;

    dispatch(histogramSearch({ query: chartProgram, from, to }));
    return dispatch(viewerSearch({
      query: tableProgram,
      from,
      to,
      target: "events",
      isBlocking: true
    }));
  };
}