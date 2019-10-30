/* @flow */
import {isEqual} from "lodash"

import type {Dispatch} from "../state/types"
import type {Space} from "../lib/Space"
import {hasGroupByProc} from "../lib/Program"
import Field, {TimeField} from "../models/Field"
import Log from "../models/Log"
import actions, {type RightClickAction} from "./actions"

export default function cellMenu(
  program: string,
  columns: string[],
  space: Space,
  dispatch: Dispatch
) {
  return function(field: Field, log: Log) {
    const isTime = field instanceof TimeField
    const isConn = log.isPath("conn")
    const isGroupBy = hasGroupByProc(program)
    const isAddr = ["addr", "set[addr]"].includes(field.type)
    const hasCol = columns.includes(field.name)
    const sameCols = isEqual(
      log.descriptor.map((d) => d.name).sort(),
      columns.sort()
    )
    const hasPackets = space.packet_support
    const virusTotal = [
      "hassh",
      "host",
      "ja3",
      "ja3s",
      "md5",
      "sha1",
      "sha256",
      "server_name",
      "query"
    ].includes(field.name)

    let menu = [
      actions.include(field, {enabled: !isTime && hasCol}),
      actions.exclude(field, {enabled: !isTime && hasCol}),
      actions.freshInclude(field, {enabled: true}),
      actions.separator(),
      actions.groupByDrillDown(program, log, {enabled: isGroupBy && sameCols}),
      actions.countBy(field, {enabled: !isTime && !isGroupBy}),
      actions.separator(),
      actions.sortAsc(field, {enabled: hasCol}),
      actions.sortDesc(field, {enabled: hasCol}),
      actions.separator(),
      actions.fromTime(field, {enabled: isTime}),
      actions.toTime(field, {enabled: isTime}),
      actions.separator(),
      actions.pcaps(log, {enabled: isConn && hasPackets}),
      actions.detail(log, {enabled: true}),
      actions.separator(),
      actions.whoisRightclick(field, {enabled: isAddr}),
      actions.virusTotalRightclick(field, {enabled: virusTotal || isAddr}),
      actions.separator(),
      actions.logResult(field, log, {enabled: true})
    ]

    return menu.map<RightClickAction>((item) => bindDispatch(item, dispatch))
  }
}

function bindDispatch(action, dispatch) {
  if (action.click) {
    return {
      ...action,
      click: action.click.bind(null, dispatch)
    }
  } else {
    return action
  }
}
