import initTestStore from "src/js/test/initTestStore"
import Boards from "./index"

let d, s
beforeEach(() => {
  const store = initTestStore()
  d = store.dispatch
  s = (f) => f(store.getState())
})

test("adding a board", () => {
  d(Boards.create({id: "1", title: "hi", tiles: []}))

  expect(s(Boards.get("1"))).toEqual({
    id: "1",
    title: "hi",
    tiles: []
  })
})

test("removing a board", () => {
  d(Boards.create({id: "1", title: "hi", tiles: []}))
  d(Boards.delete("1"))

  expect(s(Boards.all)).toEqual([])
})

test("add a tile id", () => {
  d(Boards.create({id: "1", title: "hi", tiles: []}))
  d(Boards.appendTile({id: "1", tileId: "100"}))

  expect(s(Boards.get("1"))).toEqual({id: "1", title: "hi", tiles: ["100"]})
})
