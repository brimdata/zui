import {ChartActions, ChartState} from "./types"

const init = (): ChartState => ({
  data: {keys: [], table: {}},
  status: "INIT",
  searchKey: "",
})

export default function reducer(
  state: ChartState = init(),
  action: ChartActions
) {
  switch (action.type) {
    case "CHART_RECORDS":
      return {...state, data: action.data}
    case "CHART_STATUS":
      return {...state, status: action.status}
    case "CHART_SET_SEARCH_KEY":
      return {...state, searchKey: action.key}
    case "CHART_CLEAR":
      return init()
    default:
      return state
  }
}
