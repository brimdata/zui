import {HISTOGRAM_RESULTS} from "src/panes/histogram-pane/run-query"
import Results from "../Results"
import activeTabSelect from "../Tab/activeTabSelect"
import {State} from "../types"

export const getRange = activeTabSelect((t) => t.histogram.range)

export const getInterval = activeTabSelect((t) => t.histogram.interval)

export const getNullXCount = activeTabSelect((t) => t.histogram.nullXCount)

export const getMissingXCount = activeTabSelect(
  (t) => t.histogram.missingXCount
)

export const getData = (state: State) =>
  Results.getValues(HISTOGRAM_RESULTS)(state)

export const getError = (state: State) =>
  Results.getError(HISTOGRAM_RESULTS)(state)
