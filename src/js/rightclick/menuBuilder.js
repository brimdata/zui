/* @flow */
import electronIsDev from "electron-is-dev"

import {flattenJoin} from "../lib/Array"
import actions, {type RightClickAction} from "./actions"

export default function menuBuilder() {
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
      return flattenJoin([query, field, log, debug], actions.seperator())
    }
  }
}
