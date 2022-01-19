import {Thunk} from "src/js/state/types"
import {getZealot} from "src/js/flows/getZealot"
import {Query} from "src/js/state/Queries/types"
import {zed} from "@brimdata/zealot"
import Pools from "src/js/state/Pools"
import Current from "src/js/state/Current"
import {Readable} from "stream"
import RemoteQueries from "src/js/state/RemoteQueries"
import {intersection} from "lodash"
import {Pool} from "src/js/state/Pools/types"
import {BrimWorkspace} from "src/js/brim"

export const remoteQueriesPoolName = "_remote-queries"

const recordToQuery = (r: zed.Record): Query => {
  const id = r.get<zed.String>("id").toString()
  const name = r.get<zed.String>("name").toString()
  const description = r.get<zed.String>("description").toString()
  const value = r.get<zed.String>("value").toString()

  return {
    description,
    id,
    name,
    tags: [],
    value
  }
}

export const isRemoteLib = (ids: string[]) => (_, getState) => {
  const remoteIds = RemoteQueries.get(getState())?.items.map((i) => i.id)
  return intersection(ids, remoteIds).length > 0
}

export const getRemotePoolForLake = (lakeId: string): Thunk<Pool> => {
  return (_d, getState) => {
    return Pools.getByName(lakeId, remoteQueriesPoolName)(getState())
  }
}

export const refreshRemoteQueries = (
  lake?: BrimWorkspace
): Thunk<Promise<void>> => {
  return async (dispatch) => {
    const zealot = dispatch(getZealot(lake))
    try {
      const queryReq = await zealot.query(
        `from '${remoteQueriesPoolName}'
        | split (
          => query_id:={id:id,ts:ts} | sort query_id
          => ts:=max(ts) by id | sort this
        )
        | join on query_id=this
        | tombstone==false
        | cut name, value, description, id`
      )
      const remoteRecords = await queryReq.records()
      dispatch(RemoteQueries.set(remoteRecords.map<Query>(recordToQuery)))
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
  queries: Query[],
  shouldDelete?: boolean
): Thunk<Promise<void>> => {
  return async (dispatch, getState) => {
    const zealot = dispatch(getZealot())
    let rqPoolId = Pools.getByName(
      Current.getWorkspaceId(getState()),
      remoteQueriesPoolName
    )(getState())?.id
    if (!rqPoolId) {
      // create remote-queries pool if it doesn't already exist
      const createResp = await zealot.pools.create({
        name: remoteQueriesPoolName
      })
      rqPoolId = createResp.pool.id
    }

    try {
      const data = new Readable()
      const loadPromise = zealot.pools.load(rqPoolId, "main", {
        author: "brim",
        body:
          "automatic remote query load for id(s): " +
          queries.map((q) => q.id).join(", "),
        data
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
    ts: Date.now()
  }))
