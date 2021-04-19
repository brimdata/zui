import {LogsPostArgs, LogsPostPathsArgs} from "../types"

export default {
  post({spaceId, files}: LogsPostArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(spaceId)}/log`,
      body: getBody(files)
    }
  },
  postPaths({spaceId, paths}: LogsPostPathsArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(spaceId)}/log/paths`,
      body: getPathsBody(paths)
    }
  }
}

function getBody(files: File[] | FileList) {
  const data = new FormData()
  for (const file of files) {
    data.append(file.name, file)
  }
  return data
}

function getPathsBody(paths: string[]) {
  return JSON.stringify({paths})
}
