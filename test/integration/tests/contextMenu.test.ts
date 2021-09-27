import createTestBrim from "test/integration/helpers/createTestBrim"
import {viewerResults} from "test/integration/helpers/locators"

describe("context menu tests", () => {
  let brim = createTestBrim("context-menu-test")

  beforeAll(async () => {
    await brim.ingest("types.tsv")
  })

  const quote = (v) => (v.includes('"') ? `'${v}'` : `"${v}"`)
  const cellContaining = (text) =>
    viewerResults.xpath + `//span[contains(text(), ${quote(text)})]`

  async function runTest(query, cell, rightClick) {
    await brim.search(query)
    await brim.rightClick(cell)
    await brim.clickContextMenuItem(rightClick)
    expect(await brim.viewerResults()).toMatchSnapshot()
  }

  describe("rightclick scalar strings", () => {
    function scalarString(value: string): () => Promise<void> {
      const path = "string"
      const fieldName = "scalar"
      const query = `_path=="${path}" ${fieldName}!=null | cut id, ${fieldName} | sort id`
      const cell = cellContaining(value)
      return () => runTest(query, cell, "Filter == value")
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
      const cell = cellContaining(value)
      return () => runTest(query, cell, "Filter == value")
    }
    test("1.1.1.1", scalarAddr("1.1.1.1"))
    test("fe80::58d2:2d09:e8cb:a8ad", scalarAddr("fe80::58d2:2d09:e8cb:a8ad"))
    test("::", scalarAddr("::"))
  })

  describe("rightclick scalar unset", () => {
    const UNSET = "⦻"
    function scalarUnset(value) {
      const query = `_path=="string" | cut id, scalar | sort -r id | head 10`
      const cell = cellContaining(value)
      return () => runTest(query, cell, "Filter == value")
    }
    test("unset", scalarUnset(UNSET))
  })
})
