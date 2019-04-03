/* @flow */
import {type RightClickAction, seperator} from "./actions"
import {flattenJoin} from "../lib/Array"

export default function menuBuilder() {
  let query = []
  let field = []
  let log = []

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

    build() {
      return flattenJoin([query, field, log], seperator())
    }
  }
}
