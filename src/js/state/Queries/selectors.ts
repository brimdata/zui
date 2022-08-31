import {Group, QueriesState, Query} from "./types"
import {State} from "../types"
import TreeModel from "tree-model"
import {createSelector} from "reselect"
import QueryVersions from "../QueryVersions"
import {BrimQuery} from "src/app/query-home/utils/brim-query"

export const raw = (state: State): QueriesState => state.queries

export const find = (state: State, id: string): Query | null => {
  return new TreeModel({childrenPropertyName: "items"})
    .parse(state.queries)
    .first((n) => n.model.id === id && !("items" in n.model))?.model
}

export const findRemoteQuery = (state: State, id: string): Query | null => {
  return new TreeModel({childrenPropertyName: "items"})
    .parse(state.remoteQueries)
    .first((n) => n.model.id === id && !("items" in n.model))?.model
}

export const findSessionQuery = (state: State, id: string): Query | null => {
  return state.sessionQueries[id]
}

const getQueryVersions = (state: State, id: string) =>
  QueryVersions.at(id).all(state)

export const build = createSelector(
  find,
  findRemoteQuery,
  findSessionQuery,
  getQueryVersions,
  (localMeta, remoteMeta, sessionMeta, versions) => {
    if (localMeta) return new BrimQuery(localMeta, versions)
    if (remoteMeta) return new BrimQuery(remoteMeta, versions)
    if (sessionMeta) return new BrimQuery(sessionMeta, versions)
    return null
  }
)

export const makeBuildSelector = () => {
  return createSelector(find, getQueryVersions, (meta, versions) => {
    if (!meta) return null
    return new BrimQuery(meta, versions)
  })
}

/**
 * @deprecated use find instead
 */
export const getQueryById =
  (queryId: string) =>
  (state: State): Query => {
    return find(state, queryId)
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
