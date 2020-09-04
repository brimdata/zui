

import { SearchRecord } from "../../types";
import { Thunk } from "../../state/types";
import History from "../../state/History";
import Investigation from "../../state/Investigation";
import brim from "../../brim";

export type SaveOpts = {history: boolean;investigation: boolean;};

export function saveToHistory(record: SearchRecord, opts: SaveOpts, ts: Date): Thunk {
  return (dispatch, _, {
    globalDispatch
  }) => {
    if (opts.history) {
      dispatch(History.push(record, brim.time(ts).toTs()));
    }
    if (opts.investigation) {
      globalDispatch(Investigation.push(record, brim.time(ts).toTs()));
    }
  };
}