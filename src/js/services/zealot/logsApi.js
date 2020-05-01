/* @flow */

import fsExtra from "fs-extra"

import path from "path"

import {isObject, isString} from "../../lib/is"

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
  if (isString(types)) {
    let config = types === "default" ? DEFAULT_TYPES : types
    return `
      {
        "paths": ${JSON.stringify(paths)},
        "json_type_config": ${config}
      }`
  } else if (isObject(types)) {
    return JSON.stringify({paths, json_type_config: types})
  } else {
    return JSON.stringify({paths})
  }
}
