import {LakeAction, LakesState} from "./types"
import produce from "immer"

const init = (): LakesState => {
  return {}
}

export default produce((draft: LakesState, action: LakeAction) => {
  switch (action.type) {
    case "$LAKE_ADD":
      draft[action.lake.id] = action.lake
      return
    case "$LAKE_REMOVE":
      delete draft[action.id]
      return
    case "$LAKE_SET_AUTH0_TOKEN":
      if (draft[action.lakeId] && draft[action.lakeId].authData) {
        draft[action.lakeId].authData.accessToken = action.accessToken
      }
      return
  }
}, init())
