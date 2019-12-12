/* @flow */

import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "../flows/viewer/config"
import type {DateTuple} from "../lib/TimeWindow"
import {addEveryCountProc} from "./histogramSearch"
import {addHeadProc, hasAnalytics} from "../lib/Program"
import analyticsHandler from "./analyticsHandler"
import histogramHandler from "./histogramHandler"
import viewerHandler from "../flows/viewer/viewerHandler"

type Args = {
  program: string,
  innerSpan: ?DateTuple,
  outerSpan: DateTuple,
  saveToHistory: boolean
}

export default class SearchTemplateFactory {
  program: string
  innerSpan: ?DateTuple
  outerSpan: DateTuple
  saveToHistory: boolean

  constructor(args: Args) {
    Object.assign(this, args)
  }

  type() {
    if (hasAnalytics(this.program)) return "analytic"
    else if (this.innerSpan) return "zoom"
    else return "log"
  }

  getTemplates() {
    return []
  }

  histogramTemplate() {
    return {
      name: "HistogramSearch",
      tag: "viewer",
      program: addEveryCountProc(this.program, this.outerSpan),
      span: this.outerSpan,
      handlers: this.histogramHandlers()
    }
  }

  logTemplate(span: ?DateTuple) {
    if (!span) throw "Span Required"
    return {
      name: "ViewerSearch",
      tag: "viewer",
      program: addHeadProc(this.program, PER_PAGE),
      span: span,
      handlers: [viewerHandler]
    }
  }

  analyticTemplate() {
    return {
      name: "ViewerSearch",
      tag: "viewer",
      program: addHeadProc(this.program, ANALYTIC_MAX_RESULTS),
      span: this.outerSpan,
      handlers: [viewerHandler, analyticsHandler]
    }
  }

  histogramHandlers() {
    return this.saveToHistory ? [histogramHandler] : []
  }

  analyticHandlers() {
    return this.saveToHistory
      ? [viewerHandler, analyticsHandler]
      : [viewerHandler]
  }
}
