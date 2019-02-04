/* @flow */

import * as searchBar from "../actions/searchBar"
import * as packets from "../actions/packets"
import * as logDetails from "../actions/logDetails"
import * as timeWindow from "../actions/timeWindow"
import * as view from "../actions/view"
import * as whoisActions from "../actions/whois"
import Log from "../models/Log"
import Field from "../models/Field"
import type {Dispatch} from "../reducers/types"
import {TimeField} from "../models/Field"

type Action = {
  type: "action",
  text: string,
  onClick: Event => void
}

type Seperator = {
  type: "seperator"
}

export type MenuItemData = Seperator | Action

export const exclude = (field: Field, dispatch: Dispatch) => ({
  type: "action",
  text: `Filter out this ${field.name}`,
  onClick: (e: Event) => {
    e.stopPropagation()
    dispatch(searchBar.appendQueryExclude(field))
    dispatch(searchBar.submitSearchBar())
  }
})

export const include = (field: Field, dispatch: Dispatch) => ({
  type: "action",
  text: `Only show this ${field.name}`,
  onClick: (e: Event) => {
    e.stopPropagation()
    dispatch(searchBar.appendQueryInclude(field))
    dispatch(searchBar.submitSearchBar())
  }
})

export const countBy = (field: Field, dispatch: Dispatch) => ({
  type: "action",
  text: `Count by ${field.name}`,
  onClick: (e: Event) => {
    e.stopPropagation()
    dispatch(searchBar.appendQueryCountBy(field))
    dispatch(searchBar.submitSearchBar())
  }
})

export const pcaps = (log: Log, dispatch: Dispatch) => ({
  type: "action",
  text: "Download PCAPS",
  onClick: (_e: Event) => {
    dispatch(packets.fetchPackets(log))
  }
})

export const detail = (log: Log, dispatch: Dispatch) => ({
  type: "action",
  text: "View log details",
  onClick: () => {
    dispatch(logDetails.viewLogDetail(log))
    dispatch(view.showRightSidebar())
  }
})

export const fromTime = (field: TimeField, dispatch: Dispatch) => ({
  type: "action",
  text: 'Use as "start" time',
  onClick: () => {
    dispatch(timeWindow.setOuterFromTime(field.toDate()))
    dispatch(searchBar.submitSearchBar())
  }
})

export const toTime = (field: TimeField, dispatch: Dispatch) => ({
  type: "action",
  text: 'Use as "end" time',
  onClick: () => {
    dispatch(timeWindow.setOuterToTime(field.toDate()))
    dispatch(searchBar.submitSearchBar())
  }
})

export const whois = (field: Field, dispatch: Dispatch) => ({
  type: "action",
  text: "Whois Lookup",
  onClick: () => {
    dispatch(whoisActions.fetchWhois(field.value))
  }
})

export const seperator = () => ({
  type: "seperator"
})
