import {LogsPostArgs} from "../types"
import {getDefaultJsonTypeConfig} from "../config/json_types"

export default {
  post({spaceId, paths, types}: LogsPostArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(spaceId)}/log/paths`,
      body: getBody(paths, types)
    }
  }
}

function getBody(paths: string[], types = getDefaultJsonTypeConfig()) {
  return JSON.stringify({paths, json_type_config: types})
}
