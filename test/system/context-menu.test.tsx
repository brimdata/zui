import {screen} from "@testing-library/dom"
import React from "react"
import {act} from "react-dom/test-utils"
import App from "src/js/components/App"
import data from "test/shared/data"
import {SystemTest} from "./system-test"

const system = new SystemTest("context-menu")
const file = data.getWebFile("types.tsv")

test("hello world", async () => {
  system.render(<App />)
  await act(async () => {
    await system.api.import([file])
    await system.api.search("* | count()")
  })
  const results = await screen.queryAllByRole("row").map((e) => e.textContent)
  expect(results).toMatchInlineSnapshot(`
    Array [
      "59",
    ]
  `)
})
