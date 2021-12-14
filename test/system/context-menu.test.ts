import {screen, waitForElementToBeRemoved} from "@testing-library/react"
import {SystemTest} from "./system-test"

const system = new SystemTest("context-menu")

describe("context menu tests", () => {
  beforeAll(async () => {
    system.mountApp()
    await system.importFile("types.tsv")
    await screen.findAllByRole("cell")
  }, 10_000)

  describe("rightclick scalar strings", () => {
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
    test("1.1.1.1", scalarAddr("1.1.1.1"))
    test("fe80::58d2:2d09:e8cb:a8ad", scalarAddr("fe80::58d2:2d09:e8cb:a8ad"))
    test("::", scalarAddr("::"))
  })

  describe("rightclick scalar unset", () => {
    test("unset", scalarUnset("⦻"))
  })
})

async function runTest(query: string, cellValue: string, menuText: string) {
  await system.runQuery(query)
  const cells = await screen.findAllByRole("cell")
  // This works with the empty string fields
  const cell = cells.find((c) => c.textContent === cellValue)
  await system.rightClick(cell)
  await system.click(menuText)
  expect(await system.findTableResults()).toMatchSnapshot()
}

function scalarString(value: string): () => Promise<void> {
  const query = `_path=="string" scalar!=null | cut id, scalar | sort id`
  return () => runTest(query, value, "Filter == value")
}

function scalarAddr(value: string) {
  const query = `_path=="addr" scalar!=null | cut id, scalar | sort id`
  return () => runTest(query, value, "Filter == value")
}

function scalarUnset(value: string) {
  const query = `_path=="string" | cut id, scalar | sort -r id | head 10`
  return () => runTest(query, value, "Filter == value")
}
