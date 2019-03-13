/* @flow */

import {analyticDetail, seperator, whois} from "./rightClick"
import Field from "../../models/Field"
import Log from "../../models/Log"

type Args = {
  log: Log,
  field: Field
}

export default ({log, field}: Args) => {
  const menu = []

  if (["addr", "set[addr]"].includes(field.type)) {
    menu.push(whois(field))
    menu.push(seperator())
  }

  menu.push(analyticDetail(log))

  return menu
}
