import {QueriesState, Query} from "./types"
import {State} from "../types"
import TreeModel from "tree-model"
import {includes} from "lodash"

export default {
  getRaw: (state: State): QueriesState => state.queries,
  getTags: (state: State): string[] => {
    const tagMap = {}
    new TreeModel({childrenPropertyName: "items"})
      .parse(state.queries)
      .walk((n) => {
        // skip if it is group (true means continue)
        if (!n.model.tags) return true
        n.model.tags.forEach((t) => {
          tagMap[t] = true
        })

        return true
      })

    return Object.keys(tagMap)
  },
  getQueriesByTag: (tag: string) => (state: State): Query[] => {
    const queryResults = []
    new TreeModel({childrenPropertyName: "items"})
      .parse(state.queries)
      .walk((n) => {
        if (!n.model.tags) return true
        if (includes(n.model.tags, tag)) queryResults.push(n.model)

        return true
      })

    return queryResults
  }
}
