/* @flow */

import {ANALYTIC_MAX_RESULTS} from "../../flows/viewer/config"
import {hasAnalytics} from "../../lib/Program"
import {withCommas} from "../../lib/fmt"

const EOF = "End of results 🎉"
const TRUNCATED_ANALYTICS = `Showing first ${withCommas(
  ANALYTIC_MAX_RESULTS
)} results`

export default function getEndMessage(program: string, size: number) {
  if (hasAnalytics(program) && size === ANALYTIC_MAX_RESULTS) {
    return TRUNCATED_ANALYTICS
  } else {
    return EOF
  }
}
