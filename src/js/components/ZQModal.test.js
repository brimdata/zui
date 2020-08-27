/* @flow */
import React from "react"

import {submitSearch} from "../flows/submitSearch/mod"
import Modal from "../state/Modal"
import SearchBar from "../state/SearchBar"
import ZQModal from "./ZQModal"
import logInto from "../test/helpers/loginTo"
import provide from "../test/helpers/provide"

test("renders with zq get command", async () => {
  let {store} = await logInto("cluster1", "space1")

  store.dispatchAll([
    SearchBar.changeSearchBarInput("hi"),
    submitSearch(),
    Modal.show("zq")
  ])

  let wrapper = provide(store, <ZQModal />)
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
