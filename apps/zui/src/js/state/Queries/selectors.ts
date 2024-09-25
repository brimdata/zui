import {Group, QueriesState, Query} from "./types"
import {State} from "../types"
import TreeModel from "tree-model"
import {createSelector} from "reselect"
import SessionQueries from "../SessionQueries"

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

export const getQueryIdToName = createSelector(
  raw,
  SessionQueries.raw,
  (localRaw, sessionRaw) => {
    const idNameMap = {}
    Object.values<Query>(sessionRaw).forEach(
      (session) => (idNameMap[session.id] = session.name)
    )
    new TreeModel({childrenPropertyName: "items"}).parse(localRaw).walk((n) => {
      if (!("items" in n.model)) {
        idNameMap[n.model.id] = n.model.name
      }
      return true
    })

    return idNameMap
  }
)
