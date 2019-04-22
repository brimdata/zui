/* @flow */
import {ANALYTIC_MAX_RESULTS} from "../../viewer/config"
import type {ResultsTabEnum} from "../../state/reducers/view"
import {withCommas} from "../../lib/fmt"

const EOF = "End of results 🎉"
const TRUNCATED_ANALYTICS = `Showing first ${withCommas(
  ANALYTIC_MAX_RESULTS
)} results`

export default function getEndMessage(tab: ResultsTabEnum, size: number) {
  if (tab === "analytics" && size === ANALYTIC_MAX_RESULTS) {
    return TRUNCATED_ANALYTICS
  } else {
    return EOF
  }
}
