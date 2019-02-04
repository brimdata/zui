/* @flow */

import {TimeField} from "../models/Field"
import type {Space} from "../lib/Space"
import Log from "../models/Log"
import Field from "../models/Field"
import * as actions from "../actions/rightClick"

type Action = {
  type: "action",
  text: string,
  onClick: Event => void
}

type Seperator = {
  type: "seperator"
}

type Args = {
  dispatch: Function,
  field: Field,
  log: Log,
  space: Space
}

export type MenuItemData = Seperator | Action

export default (args: Args): MenuItemData[] => [
  ...fieldActions(args),
  actions.seperator(),
  ...logActionsFunc(args)
]

const fieldActions = ({field, dispatch}) => {
  const menu = []
  if (field instanceof TimeField) {
    menu.push(actions.fromTime(field, dispatch))
    menu.push(actions.toTime(field, dispatch))
  } else {
    menu.push(actions.exclude(field, dispatch))
    menu.push(actions.include(field, dispatch))
    menu.push(actions.countBy(field, dispatch))
  }

  if (["addr", "set[addr]"].includes(field.type)) {
    menu.push(actions.seperator())
    menu.push(actions.whois(field, dispatch))
  }

  return menu
}

const logActionsFunc = ({log, space, dispatch}) => {
  if (log.isPath("conn") && space.packet_support) {
    return [actions.pcaps(log, dispatch), actions.detail(log, dispatch)]
  } else {
    return [actions.detail(log, dispatch)]
  }
}
