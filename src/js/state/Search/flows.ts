
import { SearchRecord } from "../../types";
import { Thunk } from "../types";
import Current from "../Current";
import Search from "./";
import SearchBar from "../SearchBar";

export default {
  restore(record: SearchRecord): Thunk {
    return function (dispatch) {
      dispatch(SearchBar.restoreSearchBar({
        current: record.program,
        previous: "",
        pinned: record.pins,
        editing: null,
        error: null,
        target: record.target
      }));
      dispatch(Search.setSpanArgs(record.spanArgs));
      dispatch(Search.setSpanFocus(null));
      dispatch(Current.setSpaceId(record.spaceId));
    };
  }
};