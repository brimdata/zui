/* @flow */

import {useSelector} from "react-redux"

import {
  countBy,
  exclude,
  freshInclude,
  fromTime,
  include,
  maybeAddVirusTotalRightclick,
  toTime,
  whoisRightclick
} from "./actions"
import {getPrevSearchProgram} from "../state/selectors/searchBar"
import {hasGroupByProc} from "../lib/Program"
import Field, {TimeField} from "../models/Field"
import menuBuilder from "./menuBuilder"

export function useDetailMenu() {
  let program = useSelector(getPrevSearchProgram)

  return function(field: Field) {
    const menu = menuBuilder()

    if (field instanceof TimeField) {
      menu.queryAction(fromTime(field), toTime(field))
    } else {
      menu.queryAction(exclude(field), include(field), freshInclude(field))

      if (!hasGroupByProc(program)) {
        menu.queryAction(countBy(field))
      }
    }

    if (field instanceof TimeField) {
      menu.queryAction(fromTime(field))
      menu.queryAction(toTime(field))
    }

    maybeAddVirusTotalRightclick(menu, field)

    if (["addr", "set[addr]"].includes(field.type)) {
      menu.fieldAction(whoisRightclick(field))
    }

    return menu.build()
  }
}
