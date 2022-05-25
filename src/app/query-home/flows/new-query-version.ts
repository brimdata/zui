import {nanoid} from "@reduxjs/toolkit"
import {Thunk} from "src/js/state/types"
import QueryVersions, {QueryVersion} from "src/js/state/QueryVersions"
import {getQuerySource} from "./get-query-source"
import RemoteQueries from "src/js/state/RemoteQueries"
import {setRemoteQueries} from "../../features/sidebar/flows/remote-queries"

export const newQueryVersion =
  (
    queryId: string,
    attrs: Partial<QueryVersion> = {}
  ): Thunk<Promise<QueryVersion>> =>
  async (dispatch, getState) => {
    const version: QueryVersion = {
      value: "",
      ...attrs,
      version: nanoid(),
      ts: new Date(),
    }

    const source = dispatch(getQuerySource(queryId))
    if (source === "remote") {
      const query = RemoteQueries.getQueryById(queryId)(getState())
      await dispatch(setRemoteQueries([{...query, ...version}]))
    }

    dispatch(QueryVersions.add({queryId, version}))

    return version
  }
