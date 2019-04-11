/* @flow */

import type {Dispatch} from "../reducers/types"
import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryInclude,
  changeSearchBarInput,
  clearSearchBar,
  submitSearchBar
} from "../actions/searchBar"
import {fetchPackets} from "../actions/packets"
import {fetchWhois} from "../actions/whois"
import {open} from "../lib/System"
import {setOuterFromTime, setOuterToTime} from "../actions/timeWindow"
import {showRightSidebar} from "../actions/view"
import {viewLogDetail} from "../actions/logDetails"
import Field, {TimeField} from "../models/Field"
import Log from "../models/Log"
import drillDown from "../lib/drillDown"

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
  text: "Exclude this value",
  onClick: (dispatch: Dispatch) => {
    dispatch(appendQueryExclude(field))
    dispatch(submitSearchBar())
  }
})

export const include = (field: Field) => ({
  type: "action",
  text: "Include this value",
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
  text: `Count by ${field.name}`,
  onClick: (dispatch: Dispatch) => {
    dispatch(appendQueryCountBy(field))
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
    dispatch(setOuterToTime(field.toDate()))
    dispatch(submitSearchBar())
  }
})

export const whoisRightclick = (field: Field) => ({
  type: "action",
  text: "Whois Lookup",
  onClick: (dispatch: Dispatch) => {
    dispatch(fetchWhois(field.value))
  }
})

export const groupByDrillDown = (program: string, log: Log) => ({
  type: "action",
  text: "Pivot to logs",
  onClick: (dispatch: Dispatch) => {
    const newProgram = drillDown(program, log)
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
