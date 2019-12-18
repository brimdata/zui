/* @flow */

import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "./config"
import type {DateTuple} from "../lib/TimeWindow"
import {addHeadProc, hasAnalytics} from "../lib/Program"

export type SearchArgs = {
  program: string,
  span: DateTuple,
  space: string
}

type Args = {
  program: string,
  span: DateTuple,
  spanFocus: ?DateTuple,
  space: string
}

export default {
  analytics: (tab: Args) => ({
    program: addHeadProc(tab.program, ANALYTIC_MAX_RESULTS),
    span: tab.span,
    space: tab.space
  }),

  zoom: (tab: Args) => ({
    program: addHeadProc(tab.program, PER_PAGE),
    span: tab.spanFocus || [new Date(), new Date()], // Appease flow
    space: tab.space
  }),

  events: (tab: Args) => ({
    program: addHeadProc(tab.program, PER_PAGE),
    span: tab.span,
    space: tab.space
  }),

  type({program, spanFocus}: Args) {
    if (hasAnalytics(program)) return "analytic"
    else if (spanFocus) return "zoom"
    else return "log"
  }
}
