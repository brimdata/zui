import {SearchRecord} from "../../types"
import {Thunk} from "../../state/types"
import History from "../../state/History"
import Investigation from "../../state/Investigation"
import brim from "../../brim"

export type SaveOpts = {history: boolean; investigation: boolean}

export function saveToHistory(
  connId: string | null,
  spaceId: string | null,
  record: SearchRecord,
  opts: SaveOpts,
  ts: Date
): Thunk {
  return (dispatch, _, {globalDispatch}) => {
    if (opts.history) {
      dispatch(History.push(record, brim.time(ts).toTs()))
    }
    if (opts.investigation) {
      globalDispatch(
        Investigation.push(connId, spaceId, record, brim.time(ts).toTs())
      )
    }
  }
}
