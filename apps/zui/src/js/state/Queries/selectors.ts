import {Group, QueriesState, Query} from "./types"
import {State} from "../types"
import TreeModel from "tree-model"
import {createSelector} from "reselect"

export const raw = (state: State): QueriesState => state.queries

export const find = (queries: QueriesState, id: string): Query | null => {
  return new TreeModel({childrenPropertyName: "items"})
    .parse(queries)
    .first((n) => n.model.id === id)?.model
}

export const getGroupById =
  (groupId: string) =>
  (state: State): Group => {
    return new TreeModel({childrenPropertyName: "items"})
      .parse(state.queries)
      .first((n) => n.model.id === groupId && "items" in n.model)?.model
  }

export const any = createSelector(getGroupById("root"), (group) => {
  return group.items.length > 0
})
