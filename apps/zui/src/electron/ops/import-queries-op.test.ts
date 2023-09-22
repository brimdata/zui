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
  const resp = importQueriesOp(filepath)
  expect(resp).toEqual({size: 12, id: expect.any(String)})
})

test("import non-json data", () => {
  const filepath = getPath("small-zeek.zng")
  const resp = importQueriesOp(filepath)
  expect(resp).toEqual({error: "File is not JSON"})
})

test("import json but not correct format", () => {
  const filepath = getPath("prs.json")
  const resp = importQueriesOp(filepath)
  expect(resp).toEqual({error: "Incorrect query format"})
})
