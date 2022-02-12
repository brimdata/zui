import {State} from "../types"
import {LakeStatus, LakeStatusesState} from "./types"

export default {
  get: (lakeId: string) => (state: State): LakeStatus => {
    return state.lakeStatuses[lakeId]
  },
  all: (state: State): LakeStatusesState => state.lakeStatuses
}
