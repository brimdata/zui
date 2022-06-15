import {nanoid} from "@reduxjs/toolkit"
import {Query} from "src/js/state/Queries/types"
import {Thunk} from "src/js/state/types"
import QueryVersions from "src/js/state/QueryVersions"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import actions from "./actions"
import Queries from "."
import {flattenQueryTree, getNextQueryCount} from "./helpers"

export function create(attrs: Partial<QueryVersion> = {}): Thunk<Query> {
  return (dispatch, getState) => {
    const queries = flattenQueryTree(Queries.raw(getState()), false).map(
      (n) => n.model
    )
    const query: Query = {
      id: nanoid(),
      name: `Query #${getNextQueryCount(queries)}`,
    }
    const version: QueryVersion = {
      value: "",
      ...attrs,
      version: nanoid(),
      ts: new Date(),
    }
    dispatch(actions.addItem(query))
    dispatch(QueryVersions.add({queryId: query.id, version}))
    return query
  }
}
