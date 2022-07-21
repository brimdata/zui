import {nanoid} from "@reduxjs/toolkit"
import {Query} from "src/js/state/Queries/types"
import {Thunk} from "src/js/state/types"
import QueryVersions from "src/js/state/QueryVersions"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {BrimQuery} from "src/app/query-home/utils/brim-query"
import SessionQueries from "."
import {getNextQueryCount} from "../Queries/helpers"
import Current from "../Current"

export const create =
  (attrs: Partial<QueryVersion> = {}): Thunk<BrimQuery> =>
  (dispatch, getState) => {
    const queryId = Current.getTabId(getState())
    const queries = Object.values(SessionQueries.raw(getState()))
    const query: Query = {
      id: queryId,
      name: `Session #${getNextQueryCount(queries)}`,
    }
    const version: QueryVersion = {
      value: "",
      ...attrs,
      ts: new Date().toISOString(),
      version: nanoid(),
    }
    dispatch(SessionQueries.set(query))
    dispatch(QueryVersions.add({queryId: query.id, version}))
    const versions = QueryVersions.getByQueryId(query.id)(getState())

    return new BrimQuery(query, versions)
  }
