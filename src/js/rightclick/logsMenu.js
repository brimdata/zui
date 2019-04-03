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
  pcaps,
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
        exclude(field),
        include(field),
        countBy(field),
        freshInclude(field)
      )
    }

    if (["addr", "set[addr]"].includes(field.type)) {
      menu.fieldAction(whoisRightclick(field))
    }

    if (log.isPath("conn") && space.packet_support) {
      menu.logAction(pcaps(log))
    }

    menu.logAction(detail(log))

    return menu.build()
  }
}
