import {LogsPostArgs} from "../types"
import {getDefaultJsonTypeConfig} from "../config/json_types"

export default {
  post({spaceId, files, types}: LogsPostArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(spaceId)}/log`,
      body: getBody(files, types)
    }
  }
}

function getBody(files: File[] | FileList, types = getDefaultJsonTypeConfig()) {
  const data = new FormData()
  data.append("json_config", JSON.stringify(types))
  for (const file of files) {
    data.append(file.name, file)
  }
  return data
}
