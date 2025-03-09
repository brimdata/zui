import {LoadReference} from "src/js/state/Loads/types"

export function createLoadRef(
  id: string,
  poolId: string,
  files: string[],
  query: string
): LoadReference {
  return {
    id,
    poolId,
    progress: 0,
    query,
    files,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    abortedAt: null,
    errors: [],
  }
}
