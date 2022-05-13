// import {ANALYTIC_MAX_RESULTS} from "../../flows/config"
// Can I remove this file ^

import {withCommas} from "../../lib/fmt"
import {ResultsStatus} from "src/js/state/Results/types"

export default function getEndMessage(
  status: ResultsStatus,
  aggregationLimit: number
) {
  if (status === "LIMIT") {
    return `Aggregations are limited to the first ${withCommas(
      aggregationLimit
    )} results.`
  } else {
    return "End of results"
  }
}
