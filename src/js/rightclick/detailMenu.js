/* @flow */

import {
  freshInclude,
  fromTime,
  toTime,
  whoisRightclick
} from "../rightclick/state/actions"
import Field, {TimeField} from "../models/Field"
import menuBuilder from "./menuBuilder"

export function detailMenu(field: Field) {
  const menu = menuBuilder()

  if (!(field instanceof TimeField)) {
    menu.queryAction(freshInclude(field))
  }

  if (field instanceof TimeField) {
    menu.queryAction(fromTime(field))
    menu.queryAction(toTime(field))
  }

  if (["addr", "set[addr]"].includes(field.type)) {
    menu.fieldAction(whoisRightclick(field))
  }

  return menu.build()
}
