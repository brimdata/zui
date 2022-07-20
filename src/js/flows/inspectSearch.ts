import Results from "../state/Results"
import {MAIN_RESULTS} from "../state/Results/types"
import {Thunk} from "../state/types"

export const inspectSearch =
  (): Thunk<Promise<string>> =>
  async (dispatch, getState, {api}) => {
    const zealot = await api.getZealot()

    return zealot.curl(Results.getQuery(MAIN_RESULTS)(getState()), {
      format: "zson",
    })
  }
