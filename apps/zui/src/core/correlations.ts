import {Thunk} from "src/js/state/types"
import {invoke} from "./invoke"
import {firstPage} from "./query/run"

export const runCorrelations = (): Thunk => async (dispatch, _) => {
  const correlations = await invoke("getCorrelationsOp")
  correlations.forEach(({id, query}) => dispatch(firstPage({id, query})))
}
