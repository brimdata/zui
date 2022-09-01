import {Pool} from "src/app/core/pools/pool"
import {compact, forEach, intersection} from "lodash"
import {Query} from "src/js/state/Queries/types"
import Pools from "src/js/state/Pools"
import Current from "src/js/state/Current"
import RemoteQueries from "src/js/state/RemoteQueries"
import {Thunk} from "src/js/state/types"
import {Readable} from "stream"
import {BrimLake} from "src/js/brim"
import QueryVersions from "src/js/state/QueryVersions"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {createPool} from "src/app/core/pools/create-pool"

export const remoteQueriesPoolName = "_remote-queries"

type RemoteQueryRecord = Query & QueryVersion & {tombstone?: boolean}

const queriesToRemoteQueries = (
  qs: (Query & QueryVersion)[],
  isTombstone = false
): RemoteQueryRecord[] => {
  return qs.map((q) => ({
    ...q,
    tombstone: isTombstone,
  }))
}

/*
remoteQueriesToQueries groups an array of raw query records into
an array of Query metadata and a map of QueryVersion arrays, keyed
by the queryId. It does not include queries if their most recent entry
has a tombstone, and if there are duplicate entries with the same version
then only the most recent will be used. To manage this, the provided array
of raw records must already be sorted by ts.
 */
const remoteQueriesToQueries = (
  remoteRecords: RemoteQueryRecord[]
): {queries: Query[]; versions: {[queryId: string]: QueryVersion[]}} => {
  const seenQuerySet = new Set()
  const versions = {}
  const queries = compact(
    remoteRecords.map((r) => {
      if (seenQuerySet.has(r.id)) return
      seenQuerySet.add(r.id)
      if (r.tombstone) return
      versions[r.id] = []
      const {id, name, description = "", isReadOnly = false} = r
      return {id, name, description, isReadOnly}
    })
  )

  const seenVersionSet = new Set()
  remoteRecords.forEach((r) => {
    if (!versions[r.id]) return
    if (seenVersionSet.has(r.version)) return
    seenVersionSet.add(r.version)
    const {version, value = "", pins = [], ts} = r
    versions[r.id].push({version, ts, value, pins})
  })

  return {queries, versions}
}

export const isRemoteLib = (ids: string[]) => (_d, getState) => {
  const remoteIds = RemoteQueries.raw(getState())?.items.map((i) => i.id)
  return intersection(ids, remoteIds).length > 0
}

export const getRemotePoolForLake =
  (lakeId: string): Thunk<Pool> =>
  (_d, getState) => {
    return Pools.getByName(lakeId, remoteQueriesPoolName)(getState())
  }

export const refreshRemoteQueries =
  (lake?: BrimLake): Thunk<Promise<void>> =>
  async (dispatch, gs, {api}) => {
    const zealot = await api.getZealot(lake)
    try {
      const queryReq = await zealot.query(
        `from '${remoteQueriesPoolName}'
        | sort -r ts
        | cut name, tombstone, value, description, id, ts, version, pins, quiet(isReadOnly)`
      )

      const remoteRecords = (await queryReq.js()) as (Query &
        QueryVersion & {tombstone?: boolean})[]

      const {queries, versions} = remoteQueriesToQueries(remoteRecords)

      dispatch(RemoteQueries.set(queries))
      forEach(versions, (versions, queryId) => {
        dispatch(QueryVersions.at(queryId).sync(versions))
      })
    } catch (e) {
      if (/pool not found/.test(e.message)) {
        dispatch(RemoteQueries.set([]))
        return
      } else throw e
    }
  }

/*
 setRemoteQueries will create or update Remote queries stored in a special
 pool defined in the 'remoteQueriesPoolName' constant, and this function will
 create that pool if it does not exist. To determine that existence, we rely
 on redux's list of existing pools which means that this thunk depends on
 that state being populated
 */
export const setRemoteQueries =
  (queries: (Query & QueryVersion)[]): Thunk<Promise<void>> =>
  async (dispatch) => {
    const remote = queriesToRemoteQueries(queries)
    await dispatch(loadRemoteQueries(remote))
    await dispatch(refreshRemoteQueries())
  }

const loadRemoteQueries =
  (queries: RemoteQueryRecord[]): Thunk<Promise<void>> =>
  async (dispatch, gs, {api}) => {
    const zealot = await api.getZealot()
    const rqPoolId = await dispatch(getOrCreateRemotePoolId())
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
      queries.forEach((d) => data.push(JSON.stringify(d)))
      data.push(null)
      await loadPromise
    } catch (e) {
      throw new Error("error loading remote queries: " + e)
    }
  }

const getOrCreateRemotePoolId =
  (): Thunk<Promise<string>> => async (dispatch, getState) => {
    let rqPoolId = Pools.getByName(
      Current.getLakeId(getState()),
      remoteQueriesPoolName
    )(getState())?.id
    if (!rqPoolId) {
      // create remote-queries pool if it doesn't already exist
      rqPoolId = await dispatch(createPool({name: remoteQueriesPoolName}))
    }

    return rqPoolId
  }

/*
deleteRemoteQueries handles deletion by flipping a 'tombstone' boolean column
for a given query's record. Since the intent is to delete the query, the value
and metadata for this tombstone record will be empty
 */
export const deleteRemoteQueries =
  (queryIds: string[]): Thunk<Promise<void>> =>
  async (dispatch) => {
    const queryDefaults = {
      name: "",
      version: "",
      ts: new Date().toISOString(),
      value: "",
      pins: [],
    }
    const queries = queryIds.map((id) => ({...queryDefaults, id}))
    await dispatch(loadRemoteQueries(queriesToRemoteQueries(queries, true)))
    await dispatch(refreshRemoteQueries())
  }
