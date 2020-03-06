/* @flow */
import React from "react"

import ZQGetModal from "./ZQGetModal"
import Modal from "../state/Modal"
import SearchBar from "../state/SearchBar"
import logInto from "../test/helpers/loginTo"
import provide from "../test/helpers/provide"
import submitSearch from "../flows/submitSearch"

test("renders with zq get command", async () => {
  let {store} = await logInto("cluster1", "space1")

  store.dispatchAll([
    SearchBar.changeSearchBarInput("hi"),
    submitSearch(),
    Modal.show("zq-get")
  ])

  let wrapper = provide(store, <ZQGetModal />)
  wrapper.find("input[value='Copy']").simulate("click")
  wrapper.find("input[value='Done']").simulate("click")

  expect(Modal.getName(store.getState())).toBe("")
})
