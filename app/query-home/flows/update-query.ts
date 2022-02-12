import DraftQueries from "src/js/state/DraftQueries"
import Queries from "src/js/state/Queries"
import {getQuerySource} from "./get-query-source"
import {BrimQuery} from "../utils/brim-query"
import {setRemoteQueries} from "app/features/sidebar/flows/remote-queries"

export const updateQuery = (query: BrimQuery) => async (
  dispatch
): Promise<void> => {
  const source = dispatch(getQuerySource(query.id))
  switch (source) {
    case "local":
      dispatch(Queries.editItem(query.serialize(), query.id))
      return
    case "remote":
      await dispatch(setRemoteQueries([query.serialize()]))
      return
    default:
      dispatch(DraftQueries.set(query.serialize()))
  }
}
