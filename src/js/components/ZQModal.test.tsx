import React from "react"

import Modal from "../state/Modal"
import SearchBar from "../state/SearchBar"
import ZQModal from "./ZQModal"
import logInto from "../test/helpers/loginTo"
import provide from "../test/helpers/provide"

test("renders with zq get command", async () => {
  const {store} = await logInto("cluster1", "space1")

  store.dispatchAll([SearchBar.changeSearchBarInput("hi"), Modal.show("zq")])

  const wrapper = provide(
    store,
    <ZQModal onClose={() => store.dispatch(Modal.hide())} />
  )
  wrapper
    .find("button")
    .at(0)
    .simulate("click")
  wrapper
    .find("button")
    .at(1)
    .simulate("click")

  expect(Modal.getName(store.getState())).toBe("")
})
