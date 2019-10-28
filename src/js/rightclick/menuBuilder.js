/* @flow */
import electronIsDev from "electron-is-dev"

import type {Dispatch} from "../state/types"
import {flattenJoin} from "../lib/Array"
import actions, {type RightClickAction} from "./actions"

export default function menuBuilder(dispatch: Dispatch) {
  let query = []
  let field = []
  let log = []
  let debug = []

  return {
    queryAction(...actions: RightClickAction[]) {
      query = [...query, ...actions]
    },

    fieldAction(...actions: RightClickAction[]) {
      field = [...field, ...actions]
    },

    logAction(...actions: RightClickAction[]) {
      log = [...log, ...actions]
    },

    debugAction(...actions: RightClickAction[]) {
      if (electronIsDev) {
        debug = [...debug, ...actions]
      }
    },

    build() {
      return flattenJoin(
        [query, field, log, debug],
        actions.separator()
      ).map<RightClickAction>((item) => bindDispatch(item, dispatch))
    }
  }
}

function bindDispatch(action, dispatch) {
  if (action.click) {
    return {
      ...action,
      click: action.click.bind(null, dispatch)
    }
  } else {
    return action
  }
}
