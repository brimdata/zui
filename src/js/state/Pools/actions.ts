import {
  POOLS_DETAIL,
  POOLS_INGEST_PROGRESS,
  POOLS_INGEST_WARNING_APPEND,
  POOLS_INGEST_WARNING_CLEAR,
  POOLS_SET,
  POOLS_REMOVE,
  Pool,
  POOLS_RENAME,
  POOLS_WORKSPACE_REMOVE
} from "./types"

export default {
  setPools: (workspaceId: string, pools: Partial<Pool>[]): POOLS_SET => ({
    type: "$POOLS_SET",
    workspaceId,
    pools: pools || []
  }),

  setDetail: (workspaceId: string, pool: any): POOLS_DETAIL => ({
    type: "$POOLS_DETAIL",
    workspaceId,
    pool
  }),

  rename: (
    workspaceId: string,
    poolId: string,
    newName: string
  ): POOLS_RENAME => ({
    type: "$POOLS_RENAME",
    workspaceId,
    poolId,
    newName
  }),

  remove: (workspaceId: string, poolId: string): POOLS_REMOVE => ({
    type: "$POOLS_REMOVE",
    workspaceId,
    poolId
  }),

  removeForWorkspace: (workspaceId: string): POOLS_WORKSPACE_REMOVE => ({
    type: "$POOLS_WORKSPACE_REMOVE",
    workspaceId
  }),

  setIngestProgress: (
    workspaceId: string,
    poolId: string,
    value: number | null
  ): POOLS_INGEST_PROGRESS => ({
    type: "$POOLS_INGEST_PROGRESS",
    workspaceId,
    poolId,
    value
  }),

  appendIngestWarning: (
    workspaceId: string,
    poolId: string,
    warning: string
  ): POOLS_INGEST_WARNING_APPEND => ({
    type: "$POOLS_INGEST_WARNING_APPEND",
    workspaceId,
    poolId,
    warning
  }),

  clearIngestWarnings: (
    workspaceId: string,
    poolId: string
  ): POOLS_INGEST_WARNING_CLEAR => ({
    type: "$POOLS_INGEST_WARNING_CLEAR",
    workspaceId,
    poolId
  })
}
