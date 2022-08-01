import {Group, QueriesState, Query} from "./types"
import {State} from "../types"
import TreeModel from "tree-model"
import {createSelector} from "reselect"

export const raw = (state: State): QueriesState => state.queries

export const getQueryById =
  (queryId: string) =>
  (state: State): Query => {
    return new TreeModel({childrenPropertyName: "items"})
      .parse(state.queries)
      .first((n) => n.model.id === queryId && !("items" in n.model))?.model
  }

export const getGroupById =
  (groupId: string) =>
  (state: State): Group => {
    return new TreeModel({childrenPropertyName: "items"})
      .parse(state.queries)
      .first((n) => n.model.id === groupId && "items" in n.model)?.model
  }

export const getTags = createSelector<State, QueriesState, string[]>(
  raw,
  (queries): string[] => {
    const tagMap = {}
    new TreeModel({childrenPropertyName: "items"}).parse(queries).walk((n) => {
      // skip if it is group (true means continue)
      if (!n.model.tags) return true
      n.model.tags.forEach((t) => {
        tagMap[t] = true
      })

      return true
    })

    return Object.keys(tagMap)
  }
)

export const any = createSelector(getGroupById("root"), (group) => {
  return group.items.length > 0
})
