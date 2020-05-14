/* @flow */
import path from "path"

import {last} from "../../lib/Array"
import lib from "../../lib"

let dir = path.join(__dirname, "../../state/migrations")

export default async function() {
  let migrations = await lib
    .file(dir)
    .contents()
    .then(excludeTests)
    .then(build)

  return {
    latestVersion() {
      return last(migrations).version
    }
  }
}

function excludeTests(files) {
  return files.filter((f) => !/\.test\.js/.test(f))
}

function build(files) {
  return files.map((f) => {
    // $FlowFixMe
    let migrate = require(path.join(dir, f)).default
    return {
      migrate,
      ...destructure(f)
    }
  })
}

function destructure(f) {
  let [version, name] = f.replace(".js", "").split("_")
  return {version, name}
}
