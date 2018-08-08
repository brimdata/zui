import React from "react"
import {Provider} from "react-redux"
import {initTestStore} from "../initStore"
import {mount} from "enzyme"
import BroLogRawFields from "./BroLogRawFields"
import connLog from "../mocks/connLog"

function buildComponent(props) {
  return mount(
    <Provider store={initTestStore()}>
      <BroLogRawFields {...props} />
    </Provider>
  )
}

test("field actions popup appears on click", () => {
  const c = buildComponent({broLog: connLog})

  expect(c.find(".field-actions-popup").length).toBe(0)
  c.find(".context-menu-button")
    .first()
    .simulate("click", {pageY: 0, pageX: 0})

  expect(c.find(".field-actions-popup").length).toBe(1)
})
