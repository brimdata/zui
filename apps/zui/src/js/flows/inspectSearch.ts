import Results from "../state/Results"
import {RESULTS_QUERY} from "src/panes/results-pane/run-results-query"
import {Thunk} from "../state/types"

export const inspectSearch =
  (): Thunk<Promise<string>> =>
  async (dispatch, getState, {api}) => {
    const zealot = await api.getZealot()

    return zealot.curl(Results.getQuery(RESULTS_QUERY)(getState()), {
      format: "zson",
    })
  }
