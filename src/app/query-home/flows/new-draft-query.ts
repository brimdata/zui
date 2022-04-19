import {nanoid} from "@reduxjs/toolkit"
import DraftQueries from "src/js/state/DraftQueries"
import {Query} from "src/js/state/Queries/types"
import {Thunk} from "src/js/state/types"
import {DRAFT_QUERY_NAME} from "../utils/brim-query"
import QueryVersions, {QueryVersion} from "src/js/state/QueryVersions"

type draftQueryAttrs = {
  value: string
  pins: {
    from: string
    filters: string[]
  }
}

export const newDraftQuery =
  (attrs: Partial<draftQueryAttrs> = {}): Thunk<Query> =>
  (dispatch) => {
    const query: Query = {
      id: nanoid(),
      name: DRAFT_QUERY_NAME,
    }
    const version: QueryVersion = {
      version: nanoid(),
      ts: new Date(),
      value: "",
      ...attrs,
    }
    dispatch(DraftQueries.set(query))
    dispatch(QueryVersions.add({queryId: query.id, version}))
    return query
  }
