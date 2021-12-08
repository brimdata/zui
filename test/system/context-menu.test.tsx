import {findByText, fireEvent, waitFor} from "@testing-library/dom"
import {
  act,
  cleanup,
  findAllByRole,
  findAllByText,
  screen
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import App from "src/js/components/App"
import Tab from "src/js/state/Tab"
import data from "test/shared/data"
import {SystemTest} from "./system-test"

const system = new SystemTest("context-menu")
const file = data.getWebFile("types.tsv")

async function viewerResults() {
  const table = await screen.findByRole("table")
  const headers = await screen.findAllByRole("columnheader")
  const rows = await findAllByRole(table, "cell")
  return headers.concat(rows).map((r) => r.textContent)
}

async function runTest(query: string, cellValue: string, rightClick: string) {
  act(() => system.api.search(query))
  await waitFor(
    () =>
      new Promise<void>((resolve, reject) => {
        system.select(Tab.isFetching) ? reject() : resolve()
      })
  )

  await new Promise((r) => setTimeout(r, 3000))
  console.log(await viewerResults())
  const table = await screen.findByRole("table")
  const cells = await findAllByRole(table, "cell")
  const cell = cells.find((c) => c.textContent === cellValue)
  fireEvent.contextMenu(cell)
  userEvent.click(await screen.findByText(rightClick))
  expect(await viewerResults()).toMatchSnapshot()
}

afterAll(cleanup)

jest.setTimeout(10000)

describe("context menu tests", () => {
  beforeAll(async () => {
    system.render(<App />)
    await act(() => system.api.import([file]))
    await waitFor(
      () =>
        new Promise<void>((resolve, reject) => {
          system.select(Tab.isFetching) ? reject() : resolve()
        })
    )
  })

  describe("rightclick scalar strings", () => {
    function scalarString(value: string): () => Promise<void> {
      const path = "string"
      const fieldName = "scalar"
      const query = `_path=="${path}" ${fieldName}!=null | cut id, ${fieldName} | sort id`
      return () => runTest(query, value, "Filter == value")
    }
    test("mystr", scalarString("mystr"))
    test("-", scalarString("-"))
    test('"', scalarString('"'))
    test("'", scalarString("'"))
    test(",", scalarString(","))
    test(";", scalarString(";"))
    test("∫£œßü™", scalarString("∫£œßü™"))
    test('"mystr"', scalarString('"mystr"'))
    test("'mystr'", scalarString("'mystr'"))
    test("*", scalarString("*"))
    test('"*"', scalarString('"*"'))
    test("1.1.1.1", scalarString("1.1.1.1"))
    test("null", scalarString("null"))
    test("⦻", scalarString("⦻"))
    test("\\t (tab)", scalarString("\t"))
    test("' ' (space)", scalarString(" "))
  })

  describe("rightclick scalar addrs", () => {
    function scalarAddr(value) {
      const path = "addr"
      const fieldName = "scalar"
      const query = `_path=="${path}" ${fieldName}!=null | cut id, ${fieldName} | sort id`
      return () => runTest(query, value, "Filter == value")
    }
    test("1.1.1.1", scalarAddr("1.1.1.1"))
    test("fe80::58d2:2d09:e8cb:a8ad", scalarAddr("fe80::58d2:2d09:e8cb:a8ad"))
    test("::", scalarAddr("::"))
  })

  describe("rightclick scalar unset", () => {
    const UNSET = "⦻"
    function scalarUnset(value) {
      const query = `_path=="string" | cut id, scalar | sort -r id | head 10`
      return () => runTest(query, value, "Filter == value")
    }
    test("unset", scalarUnset(UNSET))
  })
})
