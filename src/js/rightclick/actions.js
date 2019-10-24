/* @flow */

import type {Dispatch} from "../state/types"
import {add} from "../lib/Time"
import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryInclude,
  appendQuerySortBy
} from "../searchBar/actions"
import {
  changeSearchBarInput,
  clearSearchBar,
  setOuterFromTime,
  setOuterToTime,
  showRightSidebar
} from "../state/actions"
import {fetchPackets} from "../state/thunks/packets"
import {open} from "../lib/System"
import {submitSearchBar} from "../state/thunks/searchBar"
import {viewLogDetail} from "../detail/viewLogDetail"
import Field, {TimeField} from "../models/Field"
import Log from "../models/Log"
import brim from "../brim"
import modal from "../modal"

type Action = {
  type: "action",
  text: string,
  onClick: (Dispatch, Event) => void
}

type Seperator = {
  type: "seperator"
}

export type RightClickAction = Seperator | Action

const logResult = (field: Field, log: Log) => ({
  type: "action",
  text: "Log result to console",
  onClick: () => {
    console.log(JSON.stringify(log))
    console.log(JSON.stringify(field))
  }
})

const exclude = (field: Field) => ({
  type: "action",
  text: "Filter != value",
  onClick: (dispatch: Dispatch) => {
    dispatch(appendQueryExclude(field))
    dispatch(submitSearchBar())
  }
})

const include = (field: Field) => ({
  type: "action",
  text: "Filter = value",
  onClick: (dispatch: Dispatch) => {
    dispatch(appendQueryInclude(field))
    dispatch(submitSearchBar())
  }
})

const freshInclude = (field: Field) => ({
  type: "action",
  text: "New search with this value",
  onClick: (dispatch: Dispatch) => {
    dispatch(clearSearchBar())
    dispatch(changeSearchBarInput(field.queryableValue()))
    dispatch(submitSearchBar())
  }
})

const countBy = (field: Field) => ({
  type: "action",
  text: "Count by field",
  onClick: (dispatch: Dispatch) => {
    dispatch(appendQueryCountBy(field))
    dispatch(submitSearchBar())
  }
})

const sortAsc = (field: Field) => ({
  type: "action",
  text: "Sort A...Z",
  onClick(dispatch: Dispatch) {
    dispatch(appendQuerySortBy(field.name, "asc"))
    dispatch(submitSearchBar())
  }
})

const sortDesc = (field: Field) => ({
  type: "action",
  text: "Sort Z...A",
  onClick(dispatch: Dispatch) {
    dispatch(appendQuerySortBy(field.name, "desc"))
    dispatch(submitSearchBar())
  }
})

const pcaps = (log: Log) => ({
  type: "action",
  text: "Download PCAPS",
  onClick: (dispatch: Dispatch) => {
    dispatch(fetchPackets(log)).then(open)
  }
})

const detail = (log: Log) => ({
  type: "action",
  text: "Open details",
  onClick: (dispatch: Dispatch) => {
    dispatch(showRightSidebar())
    dispatch(viewLogDetail(log))
  }
})

const fromTime = (field: TimeField) => ({
  type: "action",
  text: 'Use as "start" time',
  onClick: (dispatch: Dispatch) => {
    dispatch(setOuterFromTime(field.toDate()))
    dispatch(submitSearchBar())
  }
})

const toTime = (field: TimeField) => ({
  type: "action",
  text: 'Use as "end" time',
  onClick: (dispatch: Dispatch) => {
    dispatch(setOuterToTime(add(field.toDate(), 1, "ms")))
    dispatch(submitSearchBar())
  }
})

const whoisRightclick = (field: Field) => ({
  type: "action",
  text: "Whois Lookup",
  onClick: (dispatch: Dispatch) => {
    dispatch(modal.show("whois", {addr: field.value}))
  }
})

const groupByDrillDown = (program: string, log: Log) => ({
  type: "action",
  text: "Pivot to logs",
  onClick: (dispatch: Dispatch) => {
    console.log(program, log)
    let newProgram = brim
      .program(program)
      .drillDown(brim.log(log.tuple, log.descriptor))
      .string()

    if (newProgram) {
      dispatch(clearSearchBar())
      dispatch(changeSearchBarInput(newProgram))
      dispatch(submitSearchBar())
    }
  }
})

const seperator = () => ({
  type: "seperator"
})

const virusTotalRightclick = (field: Field) => ({
  type: "action",
  text: "VirusTotal Lookup",
  onClick: () => {
    const url =
      "https://www.virustotal.com/gui/search/" + encodeURIComponent(field.value)
    open(url)
  }
})

export default {
  countBy,
  detail,
  exclude,
  freshInclude,
  fromTime,
  groupByDrillDown,
  include,
  logResult,
  pcaps,
  sortAsc,
  sortDesc,
  toTime,
  virusTotalRightclick,
  whoisRightclick,
  seperator
}
