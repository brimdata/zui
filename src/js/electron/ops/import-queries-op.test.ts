import "src/test/system/real-paths"
import {getPath} from "zui-test-data"
import {main} from "../run-main/run-main"
import {importQueriesOp} from "./import-queries-op"

beforeEach(async () => {
  await main({
    lake: false,
    devtools: false,
    releaseNotes: false,
    autoUpdater: false,
  })
})

test("import valid queries", () => {
  const filepath = getPath("brimcap-queries.json")
  const [error, count] = importQueriesOp.run(filepath)
  expect(error).toBe(null)
  expect(count).toBe(12)
})

test("import non-json data", () => {
  const filepath = getPath("small-zeek.zng")
  const [error, count] = importQueriesOp.run(filepath)
  expect(error).toBe("File is not JSON")
  expect(count).toBe(0)
})

test("import json but not correct format", () => {
  const filepath = getPath("prs.json")
  const [error, count] = importQueriesOp.run(filepath)
  expect(error).toBe("Incorrect query format")
  expect(count).toBe(0)
})
