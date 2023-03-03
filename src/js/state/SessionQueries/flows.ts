import {nanoid} from "@reduxjs/toolkit"
import {Query} from "src/js/state/Queries/types"
import {Thunk} from "src/js/state/types"
import QueryVersions from "src/js/state/QueryVersions"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {QueryModel} from "src/js/models/query-model"
import SessionQueries from "."
import {getNextCount} from "../Queries/helpers"
import Current from "../Current"

export const create =
  (attrs: Partial<QueryVersion> = {}): Thunk<QueryModel> =>
  (dispatch, getState) => {
    const queryId = Current.getTabId(getState())
    const queries = Object.values(SessionQueries.raw(getState()))
    const query: Query = {
      id: queryId,
      name: `Session #${getNextCount(queries, "Session")}`,
    }
    const version: QueryVersion = {
      value: "",
      ...attrs,
      ts: new Date().toISOString(),
      version: nanoid(),
      pins: [],
    }

    const exists = queries.find((q) => q.id === queryId)
    !exists && dispatch(SessionQueries.set(query))

    const Versions = QueryVersions.at(query.id)
    dispatch(Versions.create(version))
    const versions = Versions.all(getState())

    return new QueryModel(query, versions, "session")
  }

export const init = (id: string) => (dispatch) => {
  dispatch(SessionQueries.set({id, name: "Query Session"}))
}
