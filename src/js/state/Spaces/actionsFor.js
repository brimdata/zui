/* @flow */
import type {
  SPACES_DETAIL,
  SPACES_INGEST_SNAPSHOT,
  SPACES_REMOVE
} from "./types"
import actions from "./actions"

export default function actionsFor(clusterId: string, name: string) {
  return {
    setIngestProgress: (value: number) => {
      return actions.setIngestProgress(clusterId, name, value)
    },
    appendIngestWarning: (warning: string) => {
      return actions.appendIngestWarning(clusterId, name, warning)
    },
    clearIngestWarnings: () => {
      return actions.clearIngestWarnings(clusterId, name)
    },
    setIngestSnapshot: (count: number): SPACES_INGEST_SNAPSHOT => ({
      type: "SPACES_INGEST_SNAPSHOT",
      clusterId,
      name,
      count
    }),
    remove: (): SPACES_REMOVE => ({
      type: "SPACES_REMOVE",
      clusterId,
      name
    }),
    create: (): SPACES_DETAIL => ({
      type: "SPACES_DETAIL",
      clusterId,
      space: {name}
    })
  }
}
