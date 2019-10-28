/* @flow */
import {isEqual} from "lodash"

import type {Space} from "../lib/Space"
import {hasGroupByProc} from "../lib/Program"
import Field, {TimeField} from "../models/Field"
import Log from "../models/Log"
import actions from "./actions"
import menuBuilder from "./menuBuilder"

export default function cellMenu(
  program: string,
  columns: string[],
  space: Space
) {
  return function(field: Field, log: Log) {
    const menu = menuBuilder()

    menu.debugAction(actions.logResult(field, log))

    if (!(field instanceof TimeField) && columns.includes(field.name)) {
      menu.queryAction(actions.include(field), actions.exclude(field))
    }

    menu.queryAction(actions.freshInclude(field))

    if (!(field instanceof TimeField) && !hasGroupByProc(program)) {
      menu.queryAction(actions.countBy(field))
    }

    if (columns.includes(field.name)) {
      menu.queryAction(actions.sortAsc(field), actions.sortDesc(field))
    }

    if (log.isPath("conn") && space.packet_support) {
      menu.logAction(actions.pcaps(log))
    }

    menu.logAction(actions.detail(log))

    if (field instanceof TimeField) {
      menu.queryAction(actions.fromTime(field), actions.toTime(field))
    }

    if (["addr", "set[addr]"].includes(field.type)) {
      menu.fieldAction(actions.whoisRightclick(field))
    }

    if (
      hasGroupByProc(program) &&
      isEqual(log.descriptor.map((d) => d.name).sort(), columns.sort())
    ) {
      menu.queryAction(actions.groupByDrillDown(program, log))
    }

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
      menu.fieldAction(actions.virusTotalRightclick(field))
    }

    return menu.build()
  }
}
