import {nanoid} from "@reduxjs/toolkit"
import DraftQueries from "src/js/state/DraftQueries"
import {Query} from "src/js/state/Queries/types"
import {Thunk} from "src/js/state/types"
import {DRAFT_QUERY_NAME} from "../utils/brim-query"
import QueryVersions, {QueryVersion} from "src/js/state/QueryVersions"

export const newDraftQuery =
  (attrs: Partial<QueryVersion> = {}): Thunk<Query> =>
  (dispatch) => {
    const query: Query = {
      id: nanoid(),
      name: DRAFT_QUERY_NAME,
    }
    const version: QueryVersion = {
      value: "",
      ...attrs,
      version: nanoid(),
      ts: new Date(),
    }
    dispatch(DraftQueries.set(query))
    dispatch(QueryVersions.add({queryId: query.id, version}))
    return query
  }
