/* @flow */
import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "../../flows/config"
import type {SearchArgs, SearchType} from "./types"
import type {SearchRecord} from "../../types"
import type {State} from "../types"
import {addEveryCountProc} from "../../searches/histogramSearch"
import {addHeadProc} from "../../lib/Program"
import SearchBar from "../SearchBar"
import Tab from "../Tab"
import brim from "../../brim"

export default {
  getRecord: (state: State): SearchRecord => {
    return {
      program: SearchBar.getSearchBar(state).previous,
      pins: SearchBar.getSearchBar(state).pinned,
      spanArgs: Tab.getSpanArgs(state),
      space: Tab.spaceName(state)
    }
  },

  getArgs: (state: State): SearchArgs => {
    let program = SearchBar.getSearchProgram(state)
    let span = Tab.getSpanAsDates(state)
    let spanFocus = Tab.getSpanFocusAsDates(state)
    let space = Tab.spaceName(state)
    let type: SearchType = getArgsType(program, spanFocus)
    let perPage = type === "analytics" ? ANALYTIC_MAX_RESULTS : PER_PAGE

    return {
      tableProgram: addHeadProc(program, perPage),
      chartProgram: addEveryCountProc(program, span),
      span: spanFocus || span,
      space,
      type
    }
  }
}

function getArgsType(program, spanFocus): SearchType {
  if (brim.program(program).hasAnalytics()) return "analytics"
  else if (spanFocus) return "zoom"
  return "events"
}
