/* @flow */

import {
  detail,
  freshInclude,
  fromTime,
  groupByDrillDown,
  logResult,
  maybeAddVirusTotalRightclick,
  sortAsc,
  sortDesc,
  toTime,
  whoisRightclick
} from "./actions"
import {hasGroupByProc} from "../lib/Program"
import Field, {TimeField} from "../models/Field"
import Log from "../models/Log"
import menuBuilder from "./menuBuilder"

export function analyticsMenu(program: string) {
  return function(field: Field, log: Log) {
    const menu = menuBuilder()

    if (hasGroupByProc(program)) {
      menu.queryAction(groupByDrillDown(program, log))
    }

    if (field instanceof TimeField) {
      menu.queryAction(fromTime(field), toTime(field))
    } else {
      menu.queryAction(freshInclude(field))
    }

    menu.queryAction(sortAsc(field), sortDesc(field))

    maybeAddVirusTotalRightclick(menu, field)

    if (["addr", "set[addr]"].includes(field.type)) {
      menu.fieldAction(whoisRightclick(field))
    }

    menu.logAction(detail(log))
    menu.debugAction(logResult(field, log))

    return menu.build()
  }
}
