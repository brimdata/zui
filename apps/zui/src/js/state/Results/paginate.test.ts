import {paginate} from "./paginate"

test("works with a comment", () => {
  const result = paginate("james // comment does not block suffix", 10, 1)

  expect(result).toEqual(
    `james // comment does not block suffix
  | { i: count(), v: this}
  | i > 0
  | head 10
  | yield v`
  )
})
