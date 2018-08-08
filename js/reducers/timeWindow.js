import createReducer from "./createReducer"
import {extractLastTimeWindow} from "../changeProgramTimeWindow"

const initialState = [null, null]

export default createReducer(initialState, {
  TIME_WINDOW_SET: (state, {timeWindow}) => timeWindow,
  FILTER_NODES_SET: (state, {appliedFilters}) => {
    const {pinnedFilters, currentFilter} = appliedFilters
    const programs = [...pinnedFilters, currentFilter].map(f => f.program)

    for (let program of programs.reverse()) {
      const timeWindow = extractLastTimeWindow(program)
      if (timeWindow) return timeWindow
    }

    return [null, null]
  }
})
