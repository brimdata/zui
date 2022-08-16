import {Pool} from "./pool"

test("keys when null", () => {
  const p = new Pool({
    id: "1",
    ts: new Date(),
    name: "no keys",
    layout: {keys: null, order: "desc"},
  })
  expect(p.keys).toEqual([])
})

test("keys when array", () => {
  const p = new Pool({
    id: "1",
    ts: new Date(),
    name: "no keys",
    layout: {keys: [["nested", "here"]], order: "desc"},
  })
  expect(p.keys).toEqual([["nested", "here"]])
})
