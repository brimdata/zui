import DraftQueries from "src/js/state/DraftQueries"
import Queries from "src/js/state/Queries/index"
import {getQuerySource} from "./get-query-source"
import {setRemoteQueries} from "src/js/state/RemoteQueries/flows/remote-queries"
import {BrimQuery} from "../../../../app/query-home/utils/brim-query"
import {Query} from "src/js/state/Queries/types"

export const updateQuery =
  (query: BrimQuery, attrs: Partial<Query>) =>
  async (dispatch): Promise<void> => {
    const q = {...query.serialize(), ...attrs}
    const source = dispatch(getQuerySource(query.id))
    switch (source) {
      case "local":
        dispatch(Queries.editItem(q, query.id))
        return
      case "remote":
        await dispatch(setRemoteQueries([{...q, ...query.latestVersion()}]))
        return
      default:
        dispatch(DraftQueries.set(q))
    }
  }
