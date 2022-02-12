import {LakeStatus} from "./types"

export default {
  set(lakeId: string, status: LakeStatus) {
    return {type: "LAKE_STATUSES_SET", lakeId, status}
  },
  remove(lakeId: string) {
    return {type: "LAKE_STATUSES_REMOVE", lakeId}
  }
}
