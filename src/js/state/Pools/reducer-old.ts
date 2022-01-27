// import produce from "immer"

// import {Pool, PoolsAction, PoolsState} from "./types"

// const init: PoolsState = {}

// const poolsReducer = produce((draft, action: PoolsAction): {
//   [id: string]: Pool
// } => {
//   switch (action.type) {
//     case "$POOLS_SET":
//       return action.pools.reduce<{[id: string]: Pool}>((next, pool) => {
//         next[pool.id] = defaults(pool, draft[pool.id])
//         return next
//       }, {})

//     case "$POOLS_DETAIL":
//       var {id} = action.pool

//       draft[id] = defaults(action.pool, draft[id])
//       break

//     case "$POOLS_RENAME":
//       getPool(draft, action.poolId).name = action.newName
//       break

//     case "$POOLS_INGEST_PROGRESS":
//       getPool(draft, action.poolId).ingest.progress = action.value
//       break

//     case "$POOLS_INGEST_WARNING_APPEND":
//       getPool(draft, action.poolId).ingest.warnings.push(action.warning)
//       break

//     case "$POOLS_INGEST_WARNING_CLEAR":
//       getPool(draft, action.poolId).ingest.warnings = []
//       break

//     case "$POOLS_REMOVE":
//       delete draft[action.poolId]
//       break
//   }
// })

// export default function reducer(
//   state: PoolsState = init,
//   action: PoolsAction
// ): PoolsState {
//   if (action.type === "$POOLS_WORKSPACE_REMOVE") {
//     delete state[action.workspaceId]
//     return state
//   } else if (action.type.startsWith("$POOLS_")) {
//     return {
//       ...state,
//       [action.workspaceId]: poolsReducer(
//         state[action.workspaceId] || {},
//         action
//       )
//     }
//   } else {
//     return state
//   }
// }

// function defaults(next: Partial<Pool>, prev: Pool): Pool {
//   // It would be nice to not need to keep this ingest state in the pool
//   // object. An separate ingest reducer would be good.
//   const defaults = {min_time: {sec: 0, ns: 0}, max_time: {sec: 0, ns: 0}}
//   const defaultIngest = {progress: null, warnings: []}
//   const prevIngest = prev && prev.ingest
//   return {
//     ...defaults,
//     ...prev,
//     ...next,
//     ingest: {
//       ...defaultIngest,
//       ...prevIngest,
//       ...next.ingest
//     }
//   }
// }

// function getPool(state, id) {
//   if (state[id]) return state[id]
//   else throw new Error("No pool exists with id: " + id)
// }
