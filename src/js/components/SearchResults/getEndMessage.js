/* @flow */
import {ANALYTIC_MAX_RESULTS as MAX} from "../../models/searches/AnalyticSearch"
import type {ResultsTabEnum} from "../../state/reducers/view"
import {withCommas} from "../../lib/fmt"

const EOF = "End of results 🎉"
const TRUNCATED_ANALYTICS = `Showing first ${withCommas(MAX)} results`

export default function getEndMessage(tab: ResultsTabEnum, size: number) {
  if (tab === "analytics" && size === MAX) {
    return TRUNCATED_ANALYTICS
  } else {
    return EOF
  }
}
