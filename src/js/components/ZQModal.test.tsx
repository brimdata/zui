/**
 * @jest-environment jsdom
 */

import React from "react"

document.execCommand = jest.fn()

import Modal from "../state/Modal"
import SearchBar from "../state/SearchBar"
import ZQModal from "./ZQModal"
import logInto from "../../../test/unit/helpers/loginTo"
import provide from "../../../test/unit/helpers/provide"
import {fireEvent, screen} from "@testing-library/react"

test("renders with zq get command", async () => {
  const {store} = await logInto("workspace1", "pool1")

  store.dispatchAll([SearchBar.changeSearchBarInput("hi"), Modal.show("zq")])

  provide(store, <ZQModal onClose={() => store.dispatch(Modal.hide())} />)

  fireEvent.click(screen.getByRole("button", {name: /copy/i}))
  fireEvent.click(screen.getByRole("button", {name: /done/i}))

  expect(Modal.getName(store.getState())).toBe("")
})
