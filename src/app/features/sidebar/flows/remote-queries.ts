import {Pool} from "src/app/core/pools/pool"
import {intersection} from "lodash"
import {getZealot} from "src/js/flows/getZealot"
import {Query} from "src/js/state/Queries/types"
import Pools from "src/js/state/Pools"
import Current from "src/js/state/Current"
import RemoteQueries from "src/js/state/RemoteQueries"
import {Thunk} from "src/js/state/types"
import {Readable} from "stream"
import {BrimLake} from "src/js/brim"

export const remoteQueriesPoolName = "_remote-queries"

const queriesToRemoteQueries = (qs: Query[], isTombstone = false) => {
  return qs.map((q) => ({
    ...q,
    tombstone: isTombstone,
    ts: Date.now()
  }))
}

export const isRemoteLib = (ids: string[]) => (_d, getState) => {
  const remoteIds = RemoteQueries.raw(getState())?.items.map((i) => i.id)
  return intersection(ids, remoteIds).length > 0
}

export const getRemotePoolForLake = (lakeId: string): Thunk<Pool> => (
  _d,
  getState
) => {
  return Pools.getByName(lakeId, remoteQueriesPoolName)(getState())
}

export const refreshRemoteQueries = (
  lake?: BrimLake
): Thunk<Promise<void>> => async (dispatch) => {
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
        | cut name, value, description, id, pins, isReadOnly`
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

/*
 setRemoteQuery will create, update, or delete (by setting a 'tombstone' record)
 a remote query by id . Remote queries are stored in a special pool defined in
 the 'remoteQueriesPoolName' constant, and this function will create that pool
 if it does not exist. To determine that existence, we rely on redux's list of
 existing pools which means that this thunk depends on that state being populated
 */
export const setRemoteQueries = (
  queries: Query[],
  shouldDelete?: boolean
): Thunk<Promise<void>> => {
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
            queries.map((q) => q.id).join(", ")
        }
      })
      queriesToRemoteQueries(queries, shouldDelete).forEach((d) =>
        data.push(JSON.stringify(d))
      )
      data.push(null)
      await loadPromise
      await dispatch(refreshRemoteQueries())
    } catch (e) {
      throw new Error("error loading remote query: " + e)
    }
  }
}
