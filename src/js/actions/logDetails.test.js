/* @flow */
import {conn} from "../test/mockLogs"
import {hideRightSidebar, showRightSidebar} from "./view"
import {viewLogDetail} from "./logDetails"
import MockBoomClient from "../test/MockBoomClient"
import initTestStore from "../test/initTestStore"

describe("#viewLogDetail", () => {
  let store, log, boom
  beforeEach(() => {
    boom = new MockBoomClient().stubStream("stream")
    store = initTestStore(boom)
    log = conn()
  })

  test("when detail pane is open", () => {
    store.dispatch(showRightSidebar())
    store.dispatch(viewLogDetail(log))
    expect(store.getActions().map((a) => a.type)).toContain(
      "BOOM_SEARCHES_REGISTER"
    )
  })

  test("when detail pane is closed", () => {
    store.dispatch(hideRightSidebar())
    store.dispatch(viewLogDetail(log))
    expect(store.getActions().map((a) => a.type)).not.toContain(
      "BOOM_SEARCHES_REGISTER"
    )
  })
})
