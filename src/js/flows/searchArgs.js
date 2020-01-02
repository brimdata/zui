/* @flow */

import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "./config"
import type {DateTuple} from "../lib/TimeWindow"
import {addHeadProc, hasAnalytics} from "../lib/Program"

export type SearchArgs = {
  program: string,
  span: DateTuple,
  space: string,
  tabId: string
}

type Args = {
  program: string,
  span: DateTuple,
  spanFocus: ?DateTuple,
  space: string,
  tabId: string
}

export default {
  analytics: (args: Args) => ({
    program: addHeadProc(args.program, ANALYTIC_MAX_RESULTS),
    span: args.span,
    space: args.space,
    tabId: args.tabId
  }),

  zoom: (args: Args) => ({
    program: addHeadProc(args.program, PER_PAGE),
    span: args.spanFocus || [new Date(), new Date()], // Appease flow
    space: args.space,
    tabId: args.tabId
  }),

  events: (args: Args) => ({
    program: addHeadProc(args.program, PER_PAGE),
    span: args.span,
    space: args.space,
    tabId: args.tabId
  }),

  type({program, spanFocus}: Args) {
    if (hasAnalytics(program)) return "analytic"
    else if (spanFocus) return "zoom"
    else return "log"
  }
}
