import {dispatchToProps} from "./XFieldActionsPopup"
import * as actions from "../actions"

let dispatch
beforeEach(() => {
  dispatch = jest.fn()
})

test("appendMainSearchQueryProgram", () => {
  dispatchToProps(dispatch).appendMainSearchQueryProgram("fun times")

  expect(dispatch).toBeCalledWith(
    actions.appendMainSearchQueryProgram("fun times")
  )
})
