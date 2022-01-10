import {screen, waitForElementToBeRemoved, within} from "@testing-library/react"
import fsExtra from "fs-extra"
import os from "os"
import path from "path"
import {act} from "react-dom/test-utils"
import {SystemTest} from "test/system/system-test"

const filePath = path.join(os.tmpdir(), "results.zng")

const system = new SystemTest("export-results")

beforeAll(async () => {
  system.mountApp()
  await system.importFile("sample.tsv")
  await system.runQuery("")
})

afterEach(() => fsExtra.remove(filePath))

test("canceling the export", async () => {
  const toolbarBtn = await screen.findByRole("button", {name: "Export"})
  await system.click(toolbarBtn)
  const modal = await screen.findByRole("dialog")
  system.mockSaveDialog({canceled: true, filePath})
  const submit = within(modal).getByRole("button", {name: "Export"})
  act(() => system.click(submit))
  const cancel = within(modal).getByRole("button", {name: "Close"})
  act(() => system.click(cancel))
  expect(await fsExtra.pathExists(filePath)).toBe(false)
  await waitForElementToBeRemoved(modal)
})

test("clicking the export button", async () => {
  system.mockSaveDialog({canceled: false, filePath})
  const toolbarBtn = await screen.findByRole("button", {name: "Export"})
  await system.click(toolbarBtn)
  await screen.findByRole("heading", {name: /export results/i})
  const modal = await screen.findByRole("dialog")

  const submit = within(modal).getByRole("button", {name: "Export"})
  act(() => system.click(submit))
  await screen.findByText(/export complete/i)
  expect(fsExtra.statSync(filePath).size).toBeGreaterThan(4000)
  await waitForElementToBeRemoved(modal)
})
