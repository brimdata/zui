import {createColumns} from "./columns"

describe("#createColumns", () => {
  let widths = {a: 22, default: 100}
  let all = [
    {name: "a", type: "string", td: "1"},
    {name: "b", type: "number", td: "1"}
  ]
  let visible = [{name: "b", type: "number"}]

  test("sets the td", () => {
    const cols = createColumns(all, visible, widths)

    expect(cols.getAll().map(c => c.td)).toEqual(["1", "1"])
  })

  test("sets all selectedColumns", () => {
    const cols = createColumns(all, visible, widths)

    expect(cols.getAll().map(c => c.name)).toEqual(["a", "b"])
  })

  test("sets visibility", () => {
    const cols = createColumns(all, visible, widths)

    expect(cols.getAll().map(c => c.isVisible)).toEqual([false, true])
  })

  test("sets widths", () => {
    const cols = createColumns(all, visible, widths)

    expect(cols.getAll().map(c => c.width)).toEqual([22, 100])
  })

  test("sets visible to all if visible is empty", () => {
    visible = []
    const cols = createColumns(all, visible, widths)

    expect(cols.getAll().map(c => c.isVisible)).toEqual([true, true])
  })
})
