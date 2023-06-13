import {HISTOGRAM_RESULTS} from "src/panes/histogram-pane/run-histogram-query"
import Results from "../Results"
import activeTabSelect from "../Tab/activeTabSelect"
import {State} from "../types"

export const getRange = activeTabSelect((t) => t.histogram.range)
export const getInterval = activeTabSelect((t) => t.histogram.interval)
export const getData = (state: State) =>
  Results.getValues(HISTOGRAM_RESULTS)(state)
