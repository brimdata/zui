/* @flow */

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
  maybeAddVirusTotalRightclick,
  pcaps,
  sortAsc,
  sortDesc,
  toTime,
  whoisRightclick
} from "./actions"
import {hasGroupByProc} from "../lib/Program"
import Field, {TimeField} from "../models/Field"
import Log from "../models/Log"
import menuBuilder from "./menuBuilder"

export function logsMenu(program: string, space: Space) {
  return function(field: Field, log: Log) {
    const menu = menuBuilder()

    if (hasGroupByProc(program)) {
      menu.queryAction(groupByDrillDown(program, log))
    }

    if (field instanceof TimeField) {
      menu.queryAction(fromTime(field), toTime(field))
    } else {
      menu.queryAction(
        include(field),
        exclude(field),
        countBy(field),
        freshInclude(field)
      )
    }

    menu.queryAction(sortAsc(field), sortDesc(field))

    maybeAddVirusTotalRightclick(menu, field)

    if (["addr", "set[addr]"].includes(field.type)) {
      menu.fieldAction(whoisRightclick(field))
    }

    if (log.isPath("conn") && space.packet_support) {
      menu.logAction(pcaps(log))
    }

    menu.logAction(detail(log))
    menu.debugAction(logResult(field, log))

    return menu.build()
  }
}
