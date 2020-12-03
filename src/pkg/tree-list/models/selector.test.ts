import Selector from "./selector"

let selector
const records = Array(20).fill([{name: "a", type: "b", value: "c"}])
const dispatch = (thing) => thing
const indices = () => selector.getIndices()

beforeEach(() => {
  selector = new Selector(records.length)
})

test("select one row", () => {
  dispatch(selector.select(0))

  expect(indices()).toEqual([0])
})

test("select one row, then another", () => {
  dispatch(selector.select(0))
  dispatch(selector.select(3))

  expect(indices()).toEqual([3])
})

test("select multi one", () => {
  dispatch(selector.selectMulti(0))

  expect(indices()).toEqual([0])
})

test("select multi more than one", () => {
  dispatch(selector.selectMulti(0))
  dispatch(selector.selectMulti(5))
  dispatch(selector.selectMulti(10))

  expect(indices()).toEqual([0, 5, 10])
})

test("select mutli to deselect", () => {
  dispatch(selector.selectRange(2))
  dispatch(selector.selectMulti(1))

  expect(indices()).toEqual([0, 2])
})

test("deselect at start of range then range next", () => {
  dispatch(selector.select(5))
  dispatch(selector.selectRange(7))
  dispatch(selector.selectMulti(1))
  dispatch(selector.selectRange(3))

  dispatch(selector.selectMulti(1))
  dispatch(selector.selectRangeNext())

  expect(indices()).toEqual([2, 3, 4, 5, 6, 7])
})

test("deselect at end of range then range next", () => {
  dispatch(selector.select(5))
  dispatch(selector.selectRange(7))
  dispatch(selector.selectMulti(1))
  dispatch(selector.selectRange(3))

  dispatch(selector.selectMulti(3))
  dispatch(selector.selectRangeNext())

  expect(indices()).toEqual([1, 2, 5, 6, 7, 8])
})

test("deselect in the middle of range", () => {
  dispatch(selector.select(5))
  dispatch(selector.selectRange(7))
  dispatch(selector.selectMulti(1))
  dispatch(selector.selectRange(3))

  dispatch(selector.selectMulti(2))
  dispatch(selector.selectRangeNext())

  expect(indices()).toEqual([1, 3, 4, 5, 6, 7])
})

test("select multi outside of current range", () => {
  dispatch(selector.selectRange(2))
  dispatch(selector.selectMulti(4))
  dispatch(selector.selectMulti(6))
  dispatch(selector.selectMulti(4))
  dispatch(selector.selectRangeNext())

  expect(indices()).toEqual([0, 1, 2, 6, 7])
})

test("select range when no selection", () => {
  dispatch(selector.selectRange(2))

  expect(indices()).toEqual([0, 1, 2])
})

test("select when there is a range going backwards", () => {
  dispatch(selector.select(5))
  dispatch(selector.selectRange(3))

  expect(indices()).toEqual([3, 4, 5])
})

test("select range when you've selected a few already", () => {
  dispatch(selector.select(0))
  dispatch(selector.selectMulti(2))
  dispatch(selector.selectRange(5))

  expect(indices()).toEqual([0, 2, 3, 4, 5])
})

test("selecting a range forward, then backward", () => {
  dispatch(selector.select(3))
  dispatch(selector.selectRange(5))
  dispatch(selector.selectRange(0))

  expect(indices()).toEqual([0, 1, 2, 3])
})

test("selecting the next one", () => {
  dispatch(selector.selectNext())

  expect(indices()).toEqual([0])
})

test("selecting next a few times", () => {
  dispatch(selector.selectNext())
  dispatch(selector.selectNext())

  expect(indices()).toEqual([1])
})

test("selecting prev on init", () => {
  dispatch(selector.selectPrev())
  dispatch(selector.selectPrev())
  dispatch(selector.selectPrev())
  dispatch(selector.selectPrev())

  expect(indices()).toEqual([records.length - 4])
})

test("selecting next range", () => {
  dispatch(selector.select(18))
  dispatch(selector.selectRangeNext())
  dispatch(selector.selectRangeNext())
  dispatch(selector.selectRangeNext())

  expect(indices()).toEqual([18, 19])
})

test("selecting prev range", () => {
  dispatch(selector.select(3))
  dispatch(selector.selectRangePrev())
  dispatch(selector.selectRangePrev())
  dispatch(selector.selectRangePrev())
  dispatch(selector.selectRangePrev())

  expect(indices()).toEqual([0, 1, 2, 3])
})

test("selecting next and prev range", () => {
  dispatch(selector.select(3))
  dispatch(selector.selectRangeNext())
  dispatch(selector.selectRangePrev())
  dispatch(selector.selectRangePrev())

  expect(indices()).toEqual([2, 3])
})

test("selecting range back and forth", () => {
  dispatch(selector.select(3))
  dispatch(selector.selectRangeNext())
  dispatch(selector.selectRangePrev())

  expect(indices()).toEqual([3])
})

test("selecting then deselecting", () => {
  dispatch(selector.select(3))
  dispatch(selector.selectMulti(3))

  expect(indices()).toEqual([])
})

test("select range prev after sequential multi selects", () => {
  dispatch(selector.select(1))
  dispatch(selector.selectMulti(2))
  dispatch(selector.selectMulti(3))
  dispatch(selector.selectRangePrev())

  expect(indices()).toEqual([1, 2])
})

test("select range next after sequential multi selects", () => {
  dispatch(selector.select(3))
  dispatch(selector.selectRange(1))
  dispatch(selector.selectRangePrev())
  dispatch(selector.selectRangeNext())

  expect(indices()).toEqual([1, 2, 3])
})

test("select range next when entering new range", () => {
  dispatch(selector.select(3))
  dispatch(selector.selectMulti(4))
  dispatch(selector.selectMulti(1))
  dispatch(selector.selectRangeNext())
  dispatch(selector.selectRangeNext())

  expect(indices()).toEqual([1, 2, 3, 4, 5])
})

test("select range prev when entering new range", () => {
  dispatch(selector.select(3))
  dispatch(selector.selectMulti(4))
  dispatch(selector.selectMulti(6))
  dispatch(selector.selectRangePrev())
  dispatch(selector.selectRangePrev())

  expect(indices()).toEqual([2, 3, 4, 5, 6])
})

test("selectAll", () => {
  dispatch(selector.selectAll())

  expect(indices().length).toEqual(records.length)
})
