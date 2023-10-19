/**
 * @jest-environment jsdom
 */

import {SystemTest} from "src/test/system"
import {submit} from "./operations"
import {getPath} from "zui-test-data"
import * as zui from "src/zui"
import {waitFor} from "@testing-library/react"
import {last} from "lodash"

const system = new SystemTest("loads.operations")

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
    body: "import",
    shaper: "*",
    format: "auto",
  })
}

test("good data", async () => {
  await onSubmit(getPath("zillow.csv"))

  await waitFor(() => expect(zui.pools.all.length).toBe(1))
  await waitFor(() => expect(zui.loads.all.length).toBe(1))

  const client = await system.main.createClient(zui.window.lakeId)
  const resp = await client.query("from 'zillow.csv' | count()")
  const js = await resp.js()
  expect(js).toEqual([40])
})

test("bad data", async () => {
  await onSubmit(getPath("zed-logo.svg"))
  await waitFor(() => expect(zui.loads.all.length).toBe(2))
  const load = last(zui.loads.all)

  expect(load.errors[0]).toContain(
    "Error: /Users/jkerr/brimdata/zui/packages/zui-test-data/data/zed-logo.svg: format detection error"
  )
})
