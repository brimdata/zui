import reduceHelper from "../test/reduceHelper"
import * as r from "./notices"
import * as a from "../actions/notices"

const reduce = reduceHelper("notices", r.default, r.initialState)

test("set an error notice", () => {
  const state = reduce([a.setNoticeError("There has been an error.")])

  expect(r.getError(state)).toEqual("There has been an error.")
})

test("set an error and dismiss it", () => {
  const state = reduce([
    a.setNoticeError("There has been an error."),
    a.dismissNotice()
  ])

  expect(r.getError(state)).toEqual(null)
})
