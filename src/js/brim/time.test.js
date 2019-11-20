/* @flow */
import brim from "./"

test("date to ts", () => {
  let ts = brim.time(new Date(1)).toTs()

  expect(ts).toEqual({
    ns: 1000000,
    sec: 0
  })

  expect(brim.time(ts).toDate()).toEqual(new Date(1))
})
