/* @flow */

import {flattenJoin} from "../lib/Array"
import {
  freshInclude,
  fromTime,
  seperator,
  toTime,
  whoisRightclick
} from "../rightclick/actions"
import Field, {TimeField} from "../models/Field"

export function detailMenu(field: Field) {
  const queryActions = []
  const fieldActions = []
  const logActions = []

  if (!(field instanceof TimeField)) {
    queryActions.push(freshInclude(field))
  }

  if (field instanceof TimeField) {
    queryActions.push(fromTime(field))
    queryActions.push(toTime(field))
  }

  if (["addr", "set[addr]"].includes(field.type)) {
    fieldActions.push(whoisRightclick(field))
  }

  return flattenJoin([queryActions, fieldActions, logActions], seperator())
}
