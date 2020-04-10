/* @flow */

import fsExtra from "fs-extra"
import path from "path"

export type LogsPostArgs = {space: string, paths: string[], types?: Object}

const DEFAULT_TYPES = fsExtra.readFileSync(
  path.join(__dirname, "..", "..", "..", "..", "config", "defaultTypes.json"),
  "utf-8"
)

export default {
  post({space, paths, types}: LogsPostArgs) {
    return {
      method: "POST",
      path: `/space/${space}/log`,
      body: getBody(paths, types)
    }
  }
}

function getBody(paths, types) {
  if (types === "default") {
    return `
      {
        "paths": ${JSON.stringify(paths)},
        "json_types_config": ${DEFAULT_TYPES}
      }`
  } else {
    return JSON.stringify({paths})
  }
}
