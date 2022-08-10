/**
 * @jest-environment jsdom
 */

import Fields from "src/app/detail/Fields"
import React from "react"
import Modal from "src/js/state/Modal"
import {createRecord} from "src/test/shared/factories/zed-factory"
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "src/test/unit/helpers"
import Preferences from "./Preferences"
import {act} from "react-dom/test-utils"
import {SystemTest} from "src/test/system"

const brim = new SystemTest("preferences.test.ts")
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
  brim.store.dispatch(Modal.show("settings"))
  brim.render(<Preferences />)
})

test("change time format", async () => {
  act(() => {
    fireEvent.change($.timeFormat, {target: {value: "YYYY"}})
    fireEvent.click($.ok)
  })
  await waitForElementToBeRemoved($.modal)

  const record = createRecord({ts: new Date(2019, 9, 1, 8)})
  brim.render(<Fields record={record} />)
  expect($.dd.textContent).toBe("2019")
})

test("Brimcap YAML Config File docs", async () => {
  act(() => {
    fireEvent.change($.brimcapConfig, {target: {value: __filename}})
    fireEvent.click($.ok)
  })
  await waitForElementToBeRemoved($.modal)

  act(() => {
    brim.store.dispatch(Modal.show("settings"))
  })
  expect($.brimcapConfig.value).toBe(__filename)
})
