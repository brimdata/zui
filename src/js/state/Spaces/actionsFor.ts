
import { SPACES_DETAIL, SPACES_INGEST_SNAPSHOT, SPACES_REMOVE } from "./types";
import actions from "./actions";

export default function actionsFor(clusterId: string, spaceId: string) {
  return {
    setIngestProgress: (value: number | null) => {
      return actions.setIngestProgress(clusterId, spaceId, value);
    },
    appendIngestWarning: (warning: string) => {
      return actions.appendIngestWarning(clusterId, spaceId, warning);
    },
    clearIngestWarnings: () => {
      return actions.clearIngestWarnings(clusterId, spaceId);
    },
    setIngestSnapshot: (count: number): SPACES_INGEST_SNAPSHOT => ({
      type: "SPACES_INGEST_SNAPSHOT",
      clusterId,
      spaceId,
      count
    }),
    remove: (): SPACES_REMOVE => ({
      type: "SPACES_REMOVE",
      clusterId,
      spaceId
    }),
    create: (): SPACES_DETAIL => ({
      type: "SPACES_DETAIL",
      clusterId,
      space: { id: spaceId }
    })
  };
}