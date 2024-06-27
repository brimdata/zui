import {extractCellId} from "./extract-cell-id"

test("extract cell id", () => {
  const id = "col:1,2,3_row:99_val:1,2"
  const cellId = extractCellId(id)
  expect(cellId).toBe("col:1,2,3_row:99")
})

test("extract cell id 2", () => {
  const id = "col:1_row:99_val:1,2"
  const cellId = extractCellId(id)
  expect(cellId).toBe("col:1_row:99")
})

test("extract cell id 23", () => {
  const id = "col:1_rw:99_val:1,2"
  const cellId = extractCellId(id)
  expect(cellId).toBe(null)
})
