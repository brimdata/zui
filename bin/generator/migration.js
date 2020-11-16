import {camelCase} from "lodash"
import moment from "moment"

import path from "path"

import {write} from "../utils/file"

export async function handleMigration(input) {
  let name = camelCase(input)
  let version = moment().format("YYYYMMDDHHmm")
  let title = version + "_" + name
  let file = title + ".ts"
  let test = title + ".test.ts"
  let dir = path.join(__dirname, "../../src/js/state/migrations")

  write(path.join(dir, file), contents(name))
  write(path.join(dir, test), testContents(title, version))
}

function contents(name) {
  return `
export default function ${name}(state: any) {
  // Migrate state here
  return state
}
`
}

function testContents(title, version) {
  return `
import getTestState from "../../test/helpers/getTestState"
import migrate from "./${title}"

test("migrating ${title}", () => {
  let prev = getTestState("v0.0.0 (replace with last version)")

  let next = migrate(prev)

  expect(next).toBe("what you'd expect")
})
`
}
