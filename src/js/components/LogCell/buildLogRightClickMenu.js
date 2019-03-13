/* @flow */

import type {Dispatch} from "../../reducers/types"
import type {Space} from "../../lib/Space"
import {
  countBy,
  detail,
  exclude,
  fromTime,
  include,
  pcaps,
  seperator,
  toTime,
  whois
} from "./rightClick"
import Field, {TimeField} from "../../models/Field"
import Log from "../../models/Log"

type Action = {
  type: "action",
  text: string,
  onClick: (Dispatch, Event) => void
}

type Seperator = {
  type: "seperator"
}

type Args = {
  field: Field,
  log: Log,
  space: Space
}

export type MenuItemData = Seperator | Action

export default (args: Args): MenuItemData[] => [
  ...fieldActions(args),
  seperator(),
  ...logActionsFunc(args)
]

const fieldActions = ({field}) => {
  const menu = []
  if (field instanceof TimeField) {
    menu.push(fromTime(field))
    menu.push(toTime(field))
  } else {
    menu.push(exclude(field))
    menu.push(include(field))
    menu.push(countBy(field))
  }

  if (["addr", "set[addr]"].includes(field.type)) {
    menu.push(seperator())
    menu.push(whois(field))
  }

  return menu
}

const logActionsFunc = ({log, space}) => {
  if (log.isPath("conn") && space.packet_support) {
    return [pcaps(log), detail(log)]
  } else {
    return [detail(log)]
  }
}
