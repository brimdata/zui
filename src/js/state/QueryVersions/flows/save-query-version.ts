import {Thunk} from "src/js/state/types"
import QueryVersions from "src/js/state/QueryVersions/index"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {getQuerySource} from "../../Queries/flows/get-query-source"
import RemoteQueries from "src/js/state/RemoteQueries"
import {setRemoteQueries} from "src/js/state/RemoteQueries/flows/remote-queries"

export const saveQueryVersion =
  (queryId: string, version: QueryVersion): Thunk<Promise<QueryVersion>> =>
  async (dispatch, getState) => {
    const source = dispatch(getQuerySource(queryId))
    if (source === "remote") {
      const query = RemoteQueries.find(getState(), queryId)
      await dispatch(setRemoteQueries([{...query, ...version}]))
    }

    dispatch(QueryVersions.at(queryId).create(version))

    return version
  }
