/* @flow */
import lib from "../../lib"
import path from "path"

export default (version: string) => {
  let name = `${version}.json`
  let file = path.join(__dirname, "../states", name)
  let contents
  try {
    contents = lib.file(file).readSync()
  } catch (e) {
    throw new Error(`Missing Test state for Version ${version}
No File: ${file}
To create test state, run the app and navigate to...
App Menu => Developer => Save Session for Testing Migrations`)
  }
  return JSON.parse(contents)
}
