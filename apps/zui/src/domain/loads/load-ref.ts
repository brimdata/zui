import {LoadReference} from "src/js/state/Loads/types"

export function createLoadRef(
  id: string,
  poolId: string,
  files: string[]
): LoadReference {
  return {
    id,
    poolId,
    progress: 0,
    files,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    abortedAt: null,
    errors: [],
  }
}
