import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "../../flows/config"
import {SearchArgs, SearchType} from "./types"
import {SearchRecord} from "../../types"
import {State} from "../types"
import {addEveryCountProc} from "../../searches/histogramSearch"
import {addHeadProc} from "../../lib/Program"
import Current from "../Current"
import SearchBar from "../SearchBar"
import Tab from "../Tab"
import brim from "../../brim"
import {lakeSearchPath} from "app/router/utils/paths"
import Search from "."

const getCurrentRecord = (state: State): SearchRecord => {
  const space = Current.mustGetSpace(state)
  const searchBar = SearchBar.getSearchBar(state)
  if (searchBar.editing === null) {
    return {
      program: searchBar.current,
      pins: SearchBar.getSearchBar(state).pinned,
      spanArgs: Tab.getSpanArgs(state),
      spaceName: space.name,
      spaceId: space.id,
      target: SearchBar.getTarget(state)
    }
  } else {
    return {
      program: searchBar.previous,
      pins: SearchBar.getSearchBar(state).pinned,
      spanArgs: Tab.getSpanArgs(state),
      spaceName: space.name,
      spaceId: space.id,
      target: SearchBar.getTarget(state)
    }
  }
}

export default {
  getRecord: (state: State): SearchRecord => {
    const space = Current.mustGetSpace(state)
    return {
      program: SearchBar.getSearchBar(state).previous,
      pins: SearchBar.getSearchBar(state).pinned,
      spanArgs: Tab.getSpanArgs(state),
      spaceName: space.name,
      spaceId: space.id,
      target: SearchBar.getTarget(state)
    }
  },

  getCurrentRecord,

  getArgs: (state: State): SearchArgs => {
    const program = SearchBar.getSearchProgram(state)
    const span = Tab.getSpanAsDates(state)
    const spanFocus = Tab.getSpanFocusAsDates(state)
    const space = Current.mustGetSpace(state)
    const type: SearchType = getArgsType(program, spanFocus)
    const perPage = type === "analytics" ? ANALYTIC_MAX_RESULTS : PER_PAGE

    return {
      tableProgram: addHeadProc(program, perPage),
      chartProgram: addEveryCountProc(program, span),
      span: spanFocus || span,
      spaceId: space.id,
      spaceName: space.name,
      type
    }
  },

  createHref: (state) => {
    const record = getCurrentRecord(state)
    const spanArgsFocus = Tab.getSpanFocus(state)
    const workspaceId = Current.getWorkspaceId(state)
    const spaceId = Current.getSpaceId(state)
    return lakeSearchPath(spaceId, workspaceId, {...record, spanArgsFocus})
  }
}

function getArgsType(program, spanFocus): SearchType {
  if (brim.program(program).hasAnalytics()) return "analytics"
  else if (spanFocus) return "zoom"
  return "events"
}
