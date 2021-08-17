import Fields from "app/detail/Fields"
import React from "react"
import Modal from "src/js/state/Modal"
import {createRecord} from "test/shared/factories/zed-factory"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from "test/unit/helpers"
import {setupBrim} from "test/unit/helpers/setup-brim"
import Preferences from "./Preferences"

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
  get dataDirectory() {
    return screen.getByLabelText("Data Directory") as HTMLInputElement
  },
  get brimcapConfig() {
    return screen.getByLabelText(
      "Brimcap YAML Config File docs"
    ) as HTMLInputElement
  },
  get thousandsSeparator() {
    return screen.getByLabelText("Thousands Separator") as HTMLInputElement
  }
}

beforeEach(() => {
  brim.dispatch(Modal.show("settings"))
  render(<Preferences />, {store: brim.store})
})

test("change time zone", async () => {
  const record = createRecord({ts: new Date(2019, 9, 1, 8)})
  render(<Fields record={record} />, {store: brim.store})
  expect($.dd.textContent).toBe("2019-10-01T15:00:00.000")
  cleanup()

  render(<Preferences />, {store: brim.store})
  fireEvent.change($.timeZone, {target: {value: "US/Central"}})
  fireEvent.click($.ok)
  await waitForElementToBeRemoved($.modal)

  render(<Fields record={record} />, {store: brim.store})
  expect($.dd.textContent).toBe("2019-10-01T10:00:00.000")
})

test("change time format", async () => {
  fireEvent.change($.timeFormat, {target: {value: "YYYY"}})
  fireEvent.click($.ok)
  await waitForElementToBeRemoved($.modal)

  const record = createRecord({ts: new Date(2019, 9, 1, 8)})
  render(<Fields record={record} />, {store: brim.store})
  expect($.dd.textContent).toBe("2019")
})

test("data directory", async () => {
  fireEvent.change($.dataDirectory, {target: {value: __dirname}})
  fireEvent.click($.ok)
  await waitForElementToBeRemoved($.modal)

  brim.dispatch(Modal.show("settings"))
  expect($.dataDirectory.value).toBe(__dirname)
})

test("Brimcap YAML Config File docs", async () => {
  fireEvent.change($.brimcapConfig, {target: {value: __filename}})
  fireEvent.click($.ok)
  await waitForElementToBeRemoved($.modal)

  brim.dispatch(Modal.show("settings"))
  expect($.brimcapConfig.value).toBe(__filename)
})
