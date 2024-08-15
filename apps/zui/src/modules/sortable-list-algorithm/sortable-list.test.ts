import {SortableList} from "./sortable-list"

const state = {
  src: null,
  offsetAtStart: 0,
  offset: 0,
  itemSize: 100,
  itemCount: 5,
  itemGap: 1,
}

const createList = (override) => new SortableList({...state, ...override})
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
  const list = createList({src: 0, offsetAtStart: 10})
  expect(list.distanceToPivot).toBe(40)
})

test("#distanceToPivot when behind center on second item", () => {
  const list = createList({src: 1, offsetAtStart: 100 + 1 + 10})
  expect(list.distanceToPivot).toBe(40)
})

test("#distanceToPivot when ahead of the center on third item", () => {
  const list = createList({src: 2, offsetAtStart: 100 + 1 + 100 + 1 + 59})
  expect(list.distanceToPivot).toBe(-9)
})

/**
 * Now we test moving items out of the way as the user drags
 * the source item around. The logic goes, for each item, if
 * that item is between the src and the dst, move it either forward
 * or backward.
 */
test("list#dst dragging first item to second position", () => {
  const list = createList({src: 0, offsetAtStart: 50, offset: 100 + 1})
  expect(list.dst).toBe(1)
})

test("list#dst dragging second item to first position", () => {
  const list = createList({src: 1, offsetAtStart: 105, offset: 0})
  expect(list.dst).toBe(0)
})

test("list#dst dragging second item to last position", () => {
  const list = createList({
    src: 1,
    offsetAtStart: 105,
    offset: 0 + 1 + 100 + 1 + 100 + 1 + 100 + 1 + 100,
  })
  expect(list.dst).toBe(4)
})

test("item moves when first moves to second", () => {
  const list = createList({src: 0, offsetAtStart: 50, offset: 100 + 1})
  expect(list.dst).toBe(1)
  expect(backs(list)).toEqual("false true false false false")
  expect(forwards(list)).toEqual("false false false false false")
})

test("item moves when second moves to first", () => {
  const list = createList({src: 1, offsetAtStart: 105, offset: 0})
  expect(list.dst).toBe(0)

  expect(backs(list)).toEqual("false false false false false")
  expect(forwards(list)).toEqual("true false false false false")
})

test("item moves when second moves to last", () => {
  const list = createList({
    src: 1,
    offsetAtStart: 105,
    offset: 0 + 1 + 100 + 1 + 100 + 1 + 100 + 1 + 100,
  })
  expect(list.dst).toBe(4)
  expect(backs(list)).toEqual("false false true true true")
  expect(forwards(list)).toEqual("false false false false false")
})
