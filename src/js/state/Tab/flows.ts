import {Thunk} from "../types"
import Search from "../Search"
import Tab from "../Tab"
import brim, {Ts} from "../../brim"

export default {
  computeSpan(now: Date = new Date()): Thunk {
    return function(dispatch, getState) {
      const args = Tab.getSpanArgs(getState())
      const span = brim
        .span(args)
        .recompute(now)
        .toSpan()
      dispatch(Search.setSpan(span))
    }
  },

  setFrom(ts: Ts): Thunk {
    return function(dispatch, getState) {
      const [_, to] = Tab.getSpanArgs(getState())
      dispatch(Search.setSpanArgs([ts, to]))
    }
  },

  setTo(ts: Ts): Thunk {
    return function(dispatch, getState) {
      const [from, _] = Tab.getSpanArgs(getState())
      dispatch(Search.setSpanArgs([from, ts]))
    }
  }
}
