import {LAKE_ADD, LAKE_REMOVE, LAKE_SET_AUTH0_TOKEN, Lake} from "./types"

export default {
  add(lake: Lake): LAKE_ADD {
    return {type: "$LAKE_ADD", lake: lake}
  },
  setLakeToken(lakeId: string, accessToken: string): LAKE_SET_AUTH0_TOKEN {
    return {type: "$LAKE_SET_AUTH0_TOKEN", lakeId: lakeId, accessToken}
  },
  remove(id: string): LAKE_REMOVE {
    return {type: "$LAKE_REMOVE", id}
  },
}
