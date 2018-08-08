import {dispatchToProps} from "./XUidWaterfall"
import * as actions from "../actions"

let props, dispatch
beforeEach(() => {
  dispatch = jest.fn()
  props = dispatchToProps(dispatch)
})

test("showModal dispatches action with lineId", () => {
  const lineId = {path: "conn", uid: "123", ts: new Date("2017-01-01")}
  props.showModal(lineId)

  expect(dispatch).toHaveBeenCalledWith(actions.logDetailModalRequested(lineId))
})
