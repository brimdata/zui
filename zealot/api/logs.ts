import {LogsPostArgs, LogsPostPathsArgs} from "../types"

export default {
  post({poolId, files}: LogsPostArgs) {
    return {
      headers: new Headers({Accept: "application/json"}),
      method: "POST",
      path: `/pool/${encodeURIComponent(poolId)}/log`,
      body: getBody(files)
    }
  },
  postPaths({poolId, paths}: LogsPostPathsArgs) {
    return {
      method: "POST",
      path: `/pool/${encodeURIComponent(poolId)}/log/paths`,
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
