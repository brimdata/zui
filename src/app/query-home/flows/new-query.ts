import {nanoid} from "@reduxjs/toolkit"
import DraftQueries from "src/js/state/DraftQueries"
import {Query} from "src/js/state/Queries/types"
import {Thunk} from "src/js/state/types"
import {DRAFT_QUERY_NAME} from "../utils/brim-query"

export const newQuery = (attrs: Partial<Query> = {}): Thunk<Query> => (
  dispatch
) => {
  const query: Query = {
    id: nanoid(),
    name: DRAFT_QUERY_NAME,
    value: "",
    ...attrs
  }
  console.log(query)
  dispatch(DraftQueries.set(query))
  return query
}
