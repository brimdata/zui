/**
 * @jest-environment jsdom
 */

import {SystemTest} from "src/test/system"
import {submit} from "./operations"
import {getPath} from "zui-test-data"
import * as zui from "src/zui"
const system = new SystemTest("loaders.operations")

jest.setTimeout(5000)

async function onSubmit(file: string) {
  return await submit({
    name: "",
    poolId: "new",
    windowId: system.main.windows.byName("search")[0].id,
    key: "ts",
    order: "asc",
    files: [file],
    author: "test",
    message: "import",
    shaper: "*",
    format: "auto",
  })
}

test("good data", async () => {
  await onSubmit(getPath("zillow.csv"))

  expect(await zui.pools.all.length).toBe(1)
  const client = await system.main.createClient(zui.window.lakeId)
  const resp = await client.query("from 'zillow.csv' | count()")
  const js = await resp.js()
  expect(js).toEqual([40])
})

test("bad data", async () => {
  const err = await onSubmit(getPath("zed-logo.svg"))
  expect(err.message).toContain("format detection error")
})
