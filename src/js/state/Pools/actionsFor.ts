import {POOLS_DETAIL, POOLS_REMOVE} from "./types"
import actions from "./actions"

export default function actionsFor(workspaceId: string, poolId: string) {
  return {
    setIngestProgress: (value: number | null) => {
      return actions.setIngestProgress(workspaceId, poolId, value)
    },
    appendIngestWarning: (warning: string) => {
      return actions.appendIngestWarning(workspaceId, poolId, warning)
    },
    clearIngestWarnings: () => {
      return actions.clearIngestWarnings(workspaceId, poolId)
    },
    remove: (): POOLS_REMOVE => ({
      type: "$POOLS_REMOVE",
      workspaceId,
      poolId
    }),
    create: (): POOLS_DETAIL => ({
      type: "$POOLS_DETAIL",
      workspaceId,
      pool: {id: poolId}
    })
  }
}
