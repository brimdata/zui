/* @flow */
import {camelCase} from "lodash"
import moment from "moment"

import path from "path"

import {write} from "../utils/file"
import tron from "../../src/js/electron/tron"

export async function handleMigration(input: string) {
  let name = camelCase(input)
  let version = moment().format("YYYYMMDDHHmm")
  let title = version + "_" + name
  let file = title + ".js"
  let test = title + ".test.js"
  let dir = path.join(__dirname, "../../src/js/state/migrations")

  let migrations = await tron.migrations()
  let prevVersion = migrations.getLatestVersion()

  write(path.join(dir, file), contents(name))
  write(path.join(dir, test), testContents(title, version, prevVersion))
}

function contents(name) {
  return `/* @flow */

export default function ${name}(state: *) {
  // Migrate state here
  return state
}
`
}

function testContents(title, version, prevVersion) {
  return `/* @flow */

import getTestState from "../../test/helpers/getTestState"
import migrate from "./${title}"

test("migrating ${title}", () => {
  let prev = getTestState("${prevVersion}")

  let next = migrate(prev)

  expect(next).toBe("what you'd expect")
})
`
}
