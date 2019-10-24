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

export const logResult = (field: Field, log: Log) => ({
  type: "action",
  text: "Log result to console",
  onClick: () => {
    console.log(JSON.stringify(log))
    console.log(JSON.stringify(field))
  }
})

export const exclude = (field: Field) => ({
  type: "action",
  text: "Filter != value",
  onClick: (dispatch: Dispatch) => {
    dispatch(appendQueryExclude(field))
    dispatch(submitSearchBar())
  }
})

export const include = (field: Field) => ({
  type: "action",
  text: "Filter = value",
  onClick: (dispatch: Dispatch) => {
    dispatch(appendQueryInclude(field))
    dispatch(submitSearchBar())
  }
})

export const freshInclude = (field: Field) => ({
  type: "action",
  text: "New search with this value",
  onClick: (dispatch: Dispatch) => {
    dispatch(clearSearchBar())
    dispatch(changeSearchBarInput(field.queryableValue()))
    dispatch(submitSearchBar())
  }
})

export const countBy = (field: Field) => ({
  type: "action",
  text: "Count by field",
  onClick: (dispatch: Dispatch) => {
    dispatch(appendQueryCountBy(field))
    dispatch(submitSearchBar())
  }
})

export const sortAsc = (field: Field) => ({
  type: "action",
  text: "Sort A...Z",
  onClick(dispatch: Dispatch) {
    dispatch(appendQuerySortBy(field.name, "asc"))
    dispatch(submitSearchBar())
  }
})

export const sortDesc = (field: Field) => ({
  type: "action",
  text: "Sort Z...A",
  onClick(dispatch: Dispatch) {
    dispatch(appendQuerySortBy(field.name, "desc"))
    dispatch(submitSearchBar())
  }
})

export const pcaps = (log: Log) => ({
  type: "action",
  text: "Download PCAPS",
  onClick: (dispatch: Dispatch) => {
    dispatch(fetchPackets(log)).then(open)
  }
})

export const detail = (log: Log) => ({
  type: "action",
  text: "Open details",
  onClick: (dispatch: Dispatch) => {
    dispatch(showRightSidebar())
    dispatch(viewLogDetail(log))
  }
})

export const fromTime = (field: TimeField) => ({
  type: "action",
  text: 'Use as "start" time',
  onClick: (dispatch: Dispatch) => {
    dispatch(setOuterFromTime(field.toDate()))
    dispatch(submitSearchBar())
  }
})

export const toTime = (field: TimeField) => ({
  type: "action",
  text: 'Use as "end" time',
  onClick: (dispatch: Dispatch) => {
    dispatch(setOuterToTime(add(field.toDate(), 1, "ms")))
    dispatch(submitSearchBar())
  }
})

export const whoisRightclick = (field: Field) => ({
  type: "action",
  text: "Whois Lookup",
  onClick: (dispatch: Dispatch) => {
    dispatch(modal.show("whois", {addr: field.value}))
  }
})

export const groupByDrillDown = (program: string, log: Log) => ({
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

export const seperator = () => ({
  type: "seperator"
})

export const virusTotalRightclick = (field: Field) => ({
  type: "action",
  text: "VirusTotal Lookup",
  onClick: () => {
    const url =
      "https://www.virustotal.com/gui/search/" + encodeURIComponent(field.value)
    open(url)
  }
})

export function maybeAddVirusTotalRightclick(menu: any, field: Field) {
  if (
    ["hassh", "host", "ja3", "ja3s", "md5", "sha1", "sha256"].includes(
      field.name
    ) ||
    ["addr", "set[addr]"].includes(field.type)
  ) {
    menu.fieldAction(virusTotalRightclick(field))
  }
}
