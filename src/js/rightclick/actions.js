/* @flow */

import type {Dispatch} from "../state/types"
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
import external from "../external"
import modal from "../modal"

export type RightClickAction = {
  type?: string,
  label?: string,
  click?: () => void,
  enabled?: boolean
}

type Options = {
  enabled: boolean
}

const logResult = (field: Field, log: Log, opts: Options) => ({
  label: "Log result to console",
  click: (_: Dispatch) => {
    console.log(JSON.stringify(log))
    console.log(JSON.stringify(field))
  },
  ...opts
})

const exclude = (field: Field, opts: Options) => ({
  label: "Filter != value",
  click: (dispatch: Dispatch) => {
    dispatch(appendQueryExclude(field))
    dispatch(submitSearchBar())
  },
  ...opts
})

const include = (field: Field, opts: Options) => ({
  label: "Filter = value",
  click: (dispatch: Dispatch) => {
    dispatch(appendQueryInclude(field))
    dispatch(submitSearchBar())
  },
  ...opts
})

const freshInclude = (field: Field, opts: Options) => ({
  label: "New search with this value",
  click: (dispatch: Dispatch) => {
    dispatch(clearSearchBar())
    dispatch(changeSearchBarInput(field.queryableValue()))
    dispatch(submitSearchBar())
  },
  ...opts
})

const countBy = (field: Field, opts: Options) => ({
  label: "Count by field",
  click: (dispatch: Dispatch) => {
    dispatch(appendQueryCountBy(field))
    dispatch(submitSearchBar())
  },
  ...opts
})

const sortAsc = (field: Field, opts: Options) => ({
  label: "Sort A...Z",
  click(dispatch: Dispatch) {
    dispatch(appendQuerySortBy(field.name, "asc"))
    dispatch(submitSearchBar())
  },
  ...opts
})

const sortDesc = (field: Field, opts: Options) => ({
  label: "Sort Z...A",
  click(dispatch: Dispatch) {
    dispatch(appendQuerySortBy(field.name, "desc"))
    dispatch(submitSearchBar())
  },
  ...opts
})

const pcaps = (log: Log, opts: Options) => ({
  label: "Download PCAPS",
  click: (dispatch: Dispatch) => {
    dispatch(fetchPackets(log)).then(open)
  },
  ...opts
})

const detail = (log: Log, opts: Options) => ({
  label: "Open details",
  click: (dispatch: Dispatch) => {
    dispatch(showRightSidebar())
    dispatch(viewLogDetail(log))
  },
  ...opts
})

const fromTime = (field: Field, opts: Options) => ({
  label: 'Use as "start" time',
  click: (dispatch: Dispatch) => {
    if (field instanceof TimeField) {
      dispatch(setOuterFromTime(field.toDate()))
      dispatch(submitSearchBar())
    }
  },
  ...opts
})

const toTime = (field: Field, opts: Options) => ({
  label: 'Use as "end" time',
  click: (dispatch: Dispatch) => {
    if (field instanceof TimeField) {
      dispatch(setOuterToTime(brim.time(field.toDate()).add(1, "ms")))
      dispatch(submitSearchBar())
    }
  },
  ...opts
})

const whoisRightclick = (field: Field, opts: Options) => ({
  label: "Whois Lookup",
  click: (dispatch: Dispatch) => {
    dispatch(modal.show("whois", {addr: field.value}))
  },
  ...opts
})

const groupByDrillDown = (program: string, log: Log, opts: Options) => ({
  label: "Pivot to logs",
  click: (dispatch: Dispatch) => {
    let newProgram = brim
      .program(program)
      .drillDown(brim.log(log.tuple, log.descriptor))
      .string()

    if (newProgram) {
      dispatch(clearSearchBar())
      dispatch(changeSearchBarInput(newProgram))
      dispatch(submitSearchBar())
    }
  },
  ...opts
})

const separator = () => ({
  type: "separator"
})

const virusTotalRightclick = (field: Field, opts: Options) => ({
  label: "VirusTotal Lookup",
  click: (_: Dispatch) => open(external.virusTotalUrl(field.value)),
  ...opts
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
  separator
}
