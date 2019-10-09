/* @flow */

import {
  freshInclude,
  fromTime,
  groupByDrillDown,
  maybeAddVirusTotalRightclick,
  toTime,
  whoisRightclick
} from "./actions"
import {hasGroupByProc} from "../lib/Program"
import Field, {TimeField} from "../models/Field"
import Log from "../models/Log"
import menuBuilder from "./menuBuilder"

export function correlationMenu(program: string) {
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

    maybeAddVirusTotalRightclick(menu, field)

    if (["addr", "set[addr]"].includes(field.type)) {
      menu.fieldAction(whoisRightclick(field))
    }

    return menu.build()
  }
}
