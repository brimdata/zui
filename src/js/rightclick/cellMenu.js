/* @flow */
import {isEqual} from "lodash"

import type {Space} from "../lib/Space"
import {
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
  whoisRightclick
} from "./actions"
import {hasGroupByProc} from "../lib/Program"
import Field, {TimeField} from "../models/Field"
import Log from "../models/Log"
import menuBuilder from "./menuBuilder"

export default function cellMenu(
  program: string,
  columns: string[],
  space: Space,
  currentLog: ?Log
) {
  return function(field: Field, log: Log) {
    const menu = menuBuilder()

    // logResult
    menu.debugAction(logResult(field, log))

    // exclude
    // include
    if (!(field instanceof TimeField) && columns.includes(field.name)) {
      menu.queryAction(include(field), exclude(field))
    }

    // freshInclude
    menu.queryAction(freshInclude(field))

    // countBy
    if (!(field instanceof TimeField) && !hasGroupByProc(program)) {
      menu.queryAction(countBy(field))
    }

    // sortAsc
    // sortDesc
    if (columns.includes(field.name)) {
      menu.queryAction(sortAsc(field), sortDesc(field))
    }

    // pcaps
    if (log.isPath("conn") && space.packet_support) {
      menu.logAction(pcaps(log))
    }

    // detail
    if (!Log.isSame(log, currentLog)) {
      menu.logAction(detail(log))
    }

    // fromTime
    // toTime
    if (field instanceof TimeField) {
      menu.queryAction(fromTime(field), toTime(field))
    }

    // whoisRightclick
    if (["addr", "set[addr]"].includes(field.type)) {
      menu.fieldAction(whoisRightclick(field))
    }

    // groupByDrillDown
    if (
      hasGroupByProc(program) &&
      isEqual(log.descriptor.map((d) => d.name).sort(), columns.sort())
    ) {
      menu.queryAction(groupByDrillDown(program, log))
    }

    // virusTotalRightclickś
    if (
      [
        "hassh",
        "host",
        "ja3",
        "ja3s",
        "md5",
        "sha1",
        "sha256",
        "server_name",
        "query"
      ].includes(field.name) ||
      ["addr", "set[addr]"].includes(field.type)
    ) {
      menu.fieldAction(virusTotalRightclick(field))
    }

    return menu.build()
  }
}
