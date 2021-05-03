import {lakeSearchPath} from "app/router/utils/paths"
import brim from "../../brim"
import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "../../flows/config"
import {addHeadProc} from "../../lib/Program"
import {addEveryCountProc} from "../../searches/histogramSearch"
import {SearchRecord} from "../../types"
import Current from "../Current"
import SearchBar from "../SearchBar"
import Tab from "../Tab"
import {State} from "../types"
import {SearchArgs, SearchType} from "./types"

export const getRecord = (state: State): SearchRecord => {
  const pool = Current.mustGetPool(state)
  return {
    program: SearchBar.getSearchBar(state).current,
    pins: SearchBar.getSearchBar(state).pinned,
    spanArgs: Tab.getSpanArgs(state),
    poolName: pool.name,
    poolId: pool.id
  }
}

export const getArgs = (state: State): SearchArgs => {
  const program = SearchBar.getSearchProgram(state)
  const span = Tab.getSpanAsDates(state)
  const spanFocus = Tab.getSpanFocusAsDates(state)
  const pool = Current.mustGetPool(state)
  const type: SearchType = getArgsType(program, spanFocus)
  const perPage = type === "analytics" ? ANALYTIC_MAX_RESULTS : PER_PAGE

  return {
    tableProgram: addHeadProc(program, perPage),
    chartProgram: addEveryCountProc(program, span),
    span: spanFocus || span,
    poolId: pool.id,
    poolName: pool.name,
    type
  }
}

export const createHref = (state) => {
  const record = getRecord(state)
  const spanArgsFocus = Tab.getSpanFocus(state)
  const workspaceId = Current.getWorkspaceId(state)
  const poolId = Current.getPoolId(state)
  return lakeSearchPath(poolId, workspaceId, {...record, spanArgsFocus})
}

function getArgsType(program, spanFocus): SearchType {
  if (brim.program(program).hasAnalytics()) return "analytics"
  else if (spanFocus) return "zoom"
  return "events"
}
