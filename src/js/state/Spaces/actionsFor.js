/* @flow */
import type {
  SPACES_DETAIL,
  SPACES_INGEST_SNAPSHOT,
  SPACES_REMOVE
} from "./types"
import actions from "./actions"

export default function actionsFor(clusterId: string, spaceID: string) {
  return {
    setIngestProgress: (value: number | null) => {
      return actions.setIngestProgress(clusterId, spaceID, value)
    },
    appendIngestWarning: (warning: string) => {
      return actions.appendIngestWarning(clusterId, spaceID, warning)
    },
    clearIngestWarnings: () => {
      return actions.clearIngestWarnings(clusterId, spaceID)
    },
    setIngestSnapshot: (count: number): SPACES_INGEST_SNAPSHOT => ({
      type: "SPACES_INGEST_SNAPSHOT",
      clusterId,
      spaceID,
      count
    }),
    remove: (): SPACES_REMOVE => ({
      type: "SPACES_REMOVE",
      clusterId,
      spaceID
    }),
    create: (): SPACES_DETAIL => ({
      type: "SPACES_DETAIL",
      clusterId,
      space: {spaceID}
    })
  }
}
