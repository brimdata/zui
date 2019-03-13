/* @flow */

import type {Dispatch} from "../../reducers/types"
import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryInclude,
  changeSearchBarInput,
  removeAllSearchBarPins,
  submitSearchBar
} from "../../actions/searchBar"
import {fetchPackets} from "../../actions/packets"
import {fetchWhois} from "../../actions/whois"
import {open} from "../../lib/System"
import {showRightSidebar} from "../../actions/view"
import {viewLogDetail} from "../../actions/logDetails"
import Field, {TimeField} from "../../models/Field"
import Log from "../../models/Log"
import drillDown from "../../lib/drillDown"
import timeWindow from "../../reducers/timeWindow"

type Action = {
  type: "action",
  text: string,
  onClick: (Dispatch, Event) => void
}

type Seperator = {
  type: "seperator"
}

export type MenuItemData = Seperator | Action

export const exclude = (field: Field) => ({
  type: "action",
  text: "Exclude these values",
  onClick: (dispatch: Dispatch, e: Event) => {
    e.stopPropagation()
    dispatch(appendQueryExclude(field))
    dispatch(submitSearchBar())
  }
})

export const include = (field: Field) => ({
  type: "action",
  text: "Include these values",
  onClick: (dispatch: Dispatch, e: Event) => {
    e.stopPropagation()
    dispatch(appendQueryInclude(field))
    dispatch(submitSearchBar())
  }
})

export const countBy = (field: Field) => ({
  type: "action",
  text: `Count by ${field.name}`,
  onClick: (dispatch: Dispatch, e: Event) => {
    e.stopPropagation()
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
    dispatch(viewLogDetail(log))
    dispatch(showRightSidebar())
  }
})

export const fromTime = (field: TimeField) => ({
  type: "action",
  text: 'Use as "start" time',
  onClick: (dispatch: Dispatch) => {
    dispatch(timeWindow.setOuterFromTime(field.toDate()))
    dispatch(submitSearchBar())
  }
})

export const toTime = (field: TimeField) => ({
  type: "action",
  text: 'Use as "end" time',
  onClick: (dispatch: Dispatch) => {
    dispatch(timeWindow.setOuterToTime(field.toDate()))
    dispatch(submitSearchBar())
  }
})

export const whois = (field: Field) => ({
  type: "action",
  text: "Whois Lookup",
  onClick: (dispatch: Dispatch) => {
    dispatch(fetchWhois(field.value))
  }
})

export const groupByDrillDown = (program: string, log: Log) => ({
  type: "action",
  text: "Query for these logs",
  onClick: (dispatch: Dispatch) => {
    const newProgram = drillDown(program, log)
    if (newProgram) {
      dispatch(removeAllSearchBarPins())
      dispatch(changeSearchBarInput(newProgram))
      dispatch(submitSearchBar())
    }
  }
})

export const seperator = () => ({
  type: "seperator"
})
