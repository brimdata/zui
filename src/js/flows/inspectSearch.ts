import Results from "../state/Results"
import {Thunk} from "../state/types"

export const inspectSearch =
  (): Thunk<Promise<string>> =>
  async (dispatch, getState, {api}) => {
    const zealot = await api.getZealot()

    return zealot.curl(Results.getQuery(getState()), {
      format: "zson",
    })
  }
