import React from "react"
import {shallow} from "enzyme"
import UidTimeline from "./UidTimeline"
import * as mockLogs from "../test/mockLogs"

test("shapshot", () => {
  const wrapper = shallow(
    <UidTimeline
      log={mockLogs.conn()}
      logs={[mockLogs.conn(), mockLogs.dns(), mockLogs.http()]}
      dispatch={jest.fn()}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
