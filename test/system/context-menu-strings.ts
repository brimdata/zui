import {screen} from "@testing-library/react"
import {SystemTest} from "./system-test"

const system = new SystemTest("context-menu-strings")

describe("context menu tests", () => {
  beforeAll(async () => {
    system.mountApp()
    await system.importFile("types.tsv")
    await screen.findAllByRole("cell")
  })

  describe("rightclick scalar strings", () => {
    test("-", scalarString("-"))
    test('"', scalarString('"'))
    test("'", scalarString("'"))
    test(",", scalarString(","))
    test(";", scalarString(";"))
    test("∫£œßü™", scalarString("∫£œßü™"))
    test("*", scalarString("*"))
    test('"*"', scalarString('"*"'))
    test("1.1.1.1", scalarString("1.1.1.1"))
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
