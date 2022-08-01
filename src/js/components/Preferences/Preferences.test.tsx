/**
 * @jest-environment jsdom
 */

import Fields from "src/app/detail/Fields"
import React from "react"
import Modal from "src/js/state/Modal"
import {createRecord} from "src/test/shared/factories/zed-factory"
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "src/test/unit/helpers"
import {setupBrim} from "src/test/unit/helpers/setup-brim"
import Preferences from "./Preferences"
import {act} from "react-dom/test-utils"

const brim = setupBrim()
const $ = {
  get dd() {
    return screen.getByRole("definition")
  },
  get modal() {
    return screen.getByRole("dialog")
  },
  get ok() {
    return screen.getByRole("button", {name: "OK"})
  },
  get timeZone() {
    return screen.getByLabelText("Timezone") as HTMLInputElement
  },
  get timeFormat() {
    return screen.getByLabelText("Time Format docs") as HTMLInputElement
  },
  get brimcapConfig() {
    return screen.getByLabelText(
      "Brimcap YAML Config File docs"
    ) as HTMLInputElement
  },
  get thousandsSeparator() {
    return screen.getByLabelText("Thousands Separator") as HTMLInputElement
  },
}

beforeEach(() => {
  brim.dispatch(Modal.show("settings"))
  render(<Preferences />, {store: brim.store, api: brim.api})
})

test("change time format", async () => {
  act(() => {
    fireEvent.change($.timeFormat, {target: {value: "YYYY"}})
    fireEvent.click($.ok)
  })
  await waitForElementToBeRemoved($.modal)

  const record = createRecord({ts: new Date(2019, 9, 1, 8)})
  render(<Fields record={record} />, {store: brim.store, api: brim.api})
  expect($.dd.textContent).toBe("2019")
})

test("Brimcap YAML Config File docs", async () => {
  act(() => {
    fireEvent.change($.brimcapConfig, {target: {value: __filename}})
    fireEvent.click($.ok)
  })
  await waitForElementToBeRemoved($.modal)

  act(() => {
    brim.dispatch(Modal.show("settings"))
  })
  expect($.brimcapConfig.value).toBe(__filename)
})
