/* @flow */
import type {State} from "../reducers/types"

export const getColumnGroups = (state: State) => {
  return state.columnGroups
}

export const getColumnGroup = (state: State, group: string) => {
  return getColumnGroups(state)[group]
}
