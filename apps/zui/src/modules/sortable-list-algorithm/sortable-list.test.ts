import {SortableList} from "./sortable-list"
import {SortableListArgs} from "./types"

const args: SortableListArgs = {
  src: null,
  startingOffset: {x: 0, y: 0},
  offset: {x: 0, y: 0},
  items: {
    size: 100,
    count: 5,
    gap: 1,
  },
  listRect: {
    width: 504,
    height: 40,
    x: 0,
    y: 0,
  },
}

function createList(override: Partial<SortableListArgs>) {
  return new SortableList({...args, ...override})
}

const backs = (list) => list.items.map((i) => i.moveBack).join(" ")
const forwards = (list) => list.items.map((i) => i.moveForward).join(" ")

test("is sorting true", () => {
  const list = createList({src: null})
  expect(list.isSorting).toBe(false)
})

test("is sorting false", () => {
  const list = createList({src: 1})
  expect(list.isSorting).toBe(true)
})

/**
 *
 * The pivot point should be at the center of the source item.
 * To derrive this, you need:
 *  src index
 *  item size
 *  item gap
 *
 * It's this point that will move around as the user drags the item.
 * When the point moves into a new destination position, the underlying
 * items will move out of the way.
 *
 */
test("#distanceToPivot when behind center on first item", () => {
  const list = createList({src: 0, startingOffset: {x: 10, y: 0}})
  expect(list.distanceToPivot).toBe(40)
})

test("#distanceToPivot when behind center on second item", () => {
  const list = createList({src: 1, startingOffset: {x: 100 + 1 + 10, y: 0}})
  expect(list.distanceToPivot).toBe(40)
})

test("#distanceToPivot when ahead of the center on third item", () => {
  const list = createList({
    src: 2,
    startingOffset: {x: 100 + 1 + 100 + 1 + 59, y: 0},
  })
  expect(list.distanceToPivot).toBe(-9)
})

/**
 * Now we test moving items out of the way as the user drags
 * the source item around. The logic goes, for each item, if
 * that item is between the src and the dst, move it either forward
 * or backward.
 */
test("list#dst dragging first item to second position", () => {
  const list = createList({
    src: 0,
    startingOffset: {x: 50, y: 0},
    offset: {x: 100 + 1, y: 0},
  })
  expect(list.dst).toBe(1)
})

test("list#dst dragging second item to first position", () => {
  const list = createList({
    src: 1,
    startingOffset: {x: 105, y: 0},
    offset: {x: 0, y: 0},
  })
  expect(list.dst).toBe(0)
})

test("list#dst dragging second item to last position", () => {
  const list = createList({
    src: 1,
    startingOffset: {x: 105, y: 0},
    offset: {x: 0 + 1 + 100 + 1 + 100 + 1 + 100 + 1 + 100, y: 0},
  })
  expect(list.dst).toBe(4)
})

test("item moves when first moves to second", () => {
  const list = createList({
    src: 0,
    startingOffset: {x: 50, y: 0},
    offset: {x: 100 + 1, y: 0},
  })
  expect(list.dst).toBe(1)
  expect(backs(list)).toEqual("false true false false false")
  expect(forwards(list)).toEqual("false false false false false")
})

test("item moves when second moves to first", () => {
  const list = createList({
    src: 1,
    startingOffset: {x: 105, y: 0},
    offset: {x: 0, y: 0},
  })
  expect(list.dst).toBe(0)

  expect(backs(list)).toEqual("false false false false false")
  expect(forwards(list)).toEqual("true false false false false")
})

test("item moves when second moves to last", () => {
  const list = createList({
    src: 1,
    startingOffset: {x: 105, y: 0},
    offset: {x: 0 + 1 + 100 + 1 + 100 + 1 + 100 + 1 + 100, y: 0},
  })
  expect(list.dst).toBe(4)
  expect(backs(list)).toEqual("false false true true true")
  expect(forwards(list)).toEqual("false false false false false")
})

test("handling when the list is positioned in the page", () => {
  const list = createList({
    src: 1,
    listRect: {x: 5000, y: 1, width: 504, height: 40},
    startingOffset: {x: 5000 + 105, y: 0},
    offset: {x: 5000 + 0 + 1 + 100 + 1 + 100 + 1 + 100 + 1 + 100, y: 0},
  })
  expect(list.dst).toBe(4)
  expect(backs(list)).toEqual("false false true true true")
  expect(forwards(list)).toEqual("false false false false false")
})

test("when the offset is beyond the start of the list", () => {
  const list = createList({
    src: 1,
    listRect: {x: 5000, y: 1, width: 504, height: 40},
    startingOffset: {x: 5000 + 105, y: 0},
    offset: {x: 0, y: 0},
  })
  expect(list.dst).toBe(0)
  expect(backs(list)).toEqual("false false false false false")
  expect(forwards(list)).toEqual("true false false false false")
})

test("when the offset is beyond the end of the list", () => {
  const list = createList({
    src: 1,
    listRect: {x: 5000, y: 1, width: 504, height: 40},
    startingOffset: {x: 5000 + 105, y: 0},
    offset: {x: 8000, y: 0},
  })
  expect(list.dst).toBe(4)
  expect(backs(list)).toEqual("false false true true true")
  expect(forwards(list)).toEqual("false false false false false")
})
