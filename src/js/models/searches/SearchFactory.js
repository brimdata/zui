import {hasAnalytics} from "../../lib/Program"
import AnalyticSearch from "./AnalyticSearch"
import HistogramSearch from "./HistogramSearch"
import LogSearch from "./LogSearch"

export default class SearchFactory {
  static createAll(program, innerSpan, outerSpan) {
    if (hasAnalytics(program)) {
      return [new AnalyticSearch(program, outerSpan)]
    }

    if (innerSpan) {
      return [new LogSearch(program, innerSpan)]
    }

    return [
      new HistogramSearch(program, outerSpan),
      new LogSearch(program, outerSpan)
    ]
  }
}
