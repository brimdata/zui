import {featureIsEnabled} from "src/app/core/feature-flag"
import {intersection} from "lodash"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import RemoteQueries from "src/js/state/RemoteQueries"
import {Thunk} from "src/js/state/types"
import {Readable} from "stream"
import {BrimLake} from "../../brim"
import {getZealot} from "../../flows/getZealot"
import {Query} from "../../state/Queries/types"
import {
  deleteRemoteQueries,
  setRemoteQueries as newSetRemoteQueries,
} from "src/js/state/RemoteQueries/flows/remote-queries"
import {QueryVersion} from "src/js/state/QueryVersions/types"

export const remoteQueriesPoolName = "_remote-queries"

export const isRemoteLib = (ids: string[]) => (_, getState) => {
  const remoteIds = RemoteQueries.raw(getState())?.items.map((i) => i.id)
  return intersection(ids, remoteIds).length > 0
}

export const refreshRemoteQueries = (lake?: BrimLake): Thunk<Promise<void>> => {
  return async (dispatch) => {
    const zealot = await dispatch(getZealot(lake))
    try {
      const queryReq = await zealot.query(
        `from '${remoteQueriesPoolName}'
        | fork (
          => query_id:={id:id,ts:ts} | sort query_id
          => ts:=max(ts) by id | sort this
        )
        | join on query_id=this
        | tombstone==false
        | cut name, value, description, id, pins`
      )
      const remoteRecords = (await queryReq.js()) as Query[]
      dispatch(RemoteQueries.set(remoteRecords))
    } catch (e) {
      if (/pool not found/.test(e.message)) {
        dispatch(RemoteQueries.set([]))
        return
      } else throw e
    }
  }
}

/*
 setRemoteQuery will create, update, or delete (by setting a 'tombstone' record)
 a remote query by id . Remote queries are stored in a special pool defined in
 the 'remoteQueriesPoolName' constant, and this function will create that pool
 if it does not exist. To determine that existence, we rely on redux's list of
 existing pools which means that this thunk depends on that state being populated
 */
export const setRemoteQueries = (
  queries: (Query & QueryVersion)[],
  shouldDelete?: boolean
): Thunk<Promise<void>> => {
  if (featureIsEnabled("query-flow")) {
    if (shouldDelete) return deleteRemoteQueries(queries.map(({id}) => id))
    return newSetRemoteQueries(queries)
  }
  return async (dispatch, getState) => {
    const zealot = await dispatch(getZealot())
    let rqPoolId = Pools.getByName(
      Current.getLakeId(getState()),
      remoteQueriesPoolName
    )(getState())?.id
    if (!rqPoolId) {
      // create remote-queries pool if it doesn't already exist
      const createResp = await zealot.createPool(remoteQueriesPoolName)
      rqPoolId = createResp.pool.id
    }

    try {
      const data = new Readable()
      const loadPromise = zealot.load(data, {
        pool: rqPoolId,
        branch: "main",
        message: {
          author: "brim",
          body:
            "automatic remote query load for id(s): " +
            queries.map((q) => q.id).join(", "),
        },
      })
      queriesToRemoteQueries(queries, shouldDelete).forEach((d) =>
        data.push(JSON.stringify(d))
      )
      data.push(null)
      await loadPromise
    } catch (e) {
      throw new Error("error loading remote query: " + e)
    }
  }
}

const queriesToRemoteQueries = (qs: Query[], isTombstone = false) =>
  qs.map((q) => ({
    ...q,
    tombstone: isTombstone,
    ts: Date.now(),
  }))
