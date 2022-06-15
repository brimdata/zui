import {getGroupById} from "./selectors"
import {intersection} from "lodash"
import {nanoid} from "@reduxjs/toolkit"
import {Query} from "src/js/state/Queries/types"
import {Thunk} from "src/js/state/types"
import QueryVersions from "src/js/state/QueryVersions"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import actions from "./actions"

export const isChildOf = (id: string, ids: string[]) => (_, getState) => {
  const check = getGroupById(id)(getState())?.items.map((i) => i.id)
  return intersection(ids, check).length > 0
}

let n = 1
export function create(attrs: Partial<QueryVersion> = {}): Thunk<Query> {
  return (dispatch) => {
    const query: Query = {
      id: nanoid(),
      name: `Query #${n++}`,
    }
    const version: QueryVersion = {
      value: "",
      ...attrs,
      version: nanoid(),
      ts: new Date().toISOString(),
    }
    dispatch(actions.addItem(query))
    dispatch(QueryVersions.add({queryId: query.id, version}))
    return query
  }
}
