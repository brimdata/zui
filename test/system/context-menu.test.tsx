import {screen} from "@testing-library/dom"
import React from "react"
import App from "src/js/components/App"
import data from "test/shared/data"
import {SystemTest} from "./system-test"

const system = new SystemTest("context-menu")
const file = data.getWebFile("types.tsv")

test("hello world", async () => {
  await system.api.import([file])
  await system.api.search("*")
  system.render(<App />)

  expect(true).toBe(true)
})
