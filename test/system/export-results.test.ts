import {waitForElementToBeRemoved} from "@testing-library/dom"
import {screen, within} from "@testing-library/react"
import fsExtra from "fs-extra"
import os from "os"
import path from "path"
import {act} from "react-dom/test-utils"
import {SystemTest} from "./system-test"

const filePath = path.join(os.tmpdir(), "results.zng")

const system = new SystemTest("export-results")

beforeAll(async () => {
  system.mountApp()
  await system.importFile("sample.tsv")
  await system.runQuery("")
})

afterEach(() => fsExtra.remove(filePath))

test("clicking the export button", async () => {
  const toolbarBtn = await screen.findByRole("button", {name: "Export"})
  await system.click(toolbarBtn)

  const modal = await screen.findByRole("dialog")
  system.mockSaveDialog({canceled: false, filePath})
  const submit = within(modal).getByRole("button", {name: "Export"})
  act(() => system.click(submit))
  await screen.findByText(/export complete/i)

  await waitForElementToBeRemoved(modal)
  expect(fsExtra.statSync(filePath).size).toBe(4084)
})

test("canceling the export", async () => {
  const toolbarBtn = await screen.findByRole("button", {name: "Export"})
  await system.click(toolbarBtn)

  const modal = await screen.findByRole("dialog")
  system.mockSaveDialog({canceled: true, filePath})
  const submit = within(modal).getByRole("button", {name: "Export"})
  act(() => system.click(submit))

  expect(await fsExtra.pathExists(filePath)).toBe(false)
})
