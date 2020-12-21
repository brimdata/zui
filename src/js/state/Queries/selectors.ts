import {QueriesState} from "./types"
import {State} from "../types"
import TreeModel from "tree-model"
import {createSelector} from "reselect"

export const getRaw = (state: State): QueriesState => state.queries

export const getTags = createSelector<State, QueriesState, string[]>(
  getRaw,
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
