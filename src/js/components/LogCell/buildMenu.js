/* @flow */

import * as searchBar from "../../actions/searchBar"
import * as packets from "../../actions/packets"
import * as logDetails from "../../actions/logDetails"
import * as timeWindow from "../../actions/timeWindow"
import * as view from "../../actions/view"
import * as whoisActions from "../../actions/whois"
import {TimeField} from "../../models/Field"
import type {Space} from "../../lib/Space"
import Log from "../../models/Log"
import Field from "../../models/Field"

type Action = {
  type: "action",
  text: string,
  onClick: Event => void
}

type Seperator = {
  type: "seperator"
}

type Args = {
  dispatch: Function,
  field: Field,
  log: Log,
  space: Space
}

export type MenuItemData = Seperator | Action

export default (args: Args): MenuItemData[] => [
  ...fieldActions(args),
  seperator(),
  ...logActionsFunc(args)
]

const fieldActions = ({field, dispatch}) => {
  const actions = []
  if (field instanceof TimeField) {
    actions.push(fromTime(field, dispatch))
    actions.push(toTime(field, dispatch))
  } else {
    actions.push(exclude(field, dispatch))
    actions.push(include(field, dispatch))
    actions.push(countBy(field, dispatch))
  }

  if (["addr", "set[addr]"].includes(field.type)) {
    actions.push(seperator())
    actions.push(whois(field, dispatch))
  }

  return actions
}

const logActionsFunc = ({log, space, dispatch}) => {
  if (log.isPath("conn") && space.packet_support) {
    return [pcaps(log, dispatch), detail(log, dispatch)]
  } else {
    return [detail(log, dispatch)]
  }
}

const exclude = (field, dispatch) => ({
  type: "action",
  text: "Filter out these values",
  onClick: (e: Event) => {
    e.stopPropagation()
    dispatch(searchBar.appendQueryExclude(field))
    dispatch(searchBar.submitSearchBar())
  }
})

const include = (field, dispatch) => ({
  type: "action",
  text: "Only show these values",
  onClick: (e: Event) => {
    e.stopPropagation()
    dispatch(searchBar.appendQueryInclude(field))
    dispatch(searchBar.submitSearchBar())
  }
})

const countBy = (field, dispatch) => ({
  type: "action",
  text: `Count by ${field.name}`,
  onClick: (e: Event) => {
    e.stopPropagation()
    dispatch(searchBar.appendQueryCountBy(field))
    dispatch(searchBar.submitSearchBar())
  }
})

const pcaps = (log, dispatch) => ({
  type: "action",
  text: "Download PCAPS",
  onClick: (_e: Event) => {
    dispatch(packets.fetchPackets(log))
  }
})

const detail = (log, dispatch) => ({
  type: "action",
  text: "View log details",
  onClick: () => {
    dispatch(logDetails.viewLogDetail(log))
    dispatch(view.showRightSidebar())
  }
})

const fromTime = (field, dispatch) => ({
  type: "action",
  text: 'Use as "start" time',
  onClick: () => {
    dispatch(timeWindow.setOuterFromTime(field.toDate()))
    dispatch(searchBar.submitSearchBar())
  }
})

const toTime = (field, dispatch) => ({
  type: "action",
  text: 'Use as "end" time',
  onClick: () => {
    dispatch(timeWindow.setOuterToTime(field.toDate()))
    dispatch(searchBar.submitSearchBar())
  }
})

const whois = (field, dispatch) => ({
  type: "action",
  text: "Whois Lookup",
  onClick: () => {
    dispatch(whoisActions.fetchWhois(field.value))
  }
})

const seperator = () => ({
  type: "seperator"
})
