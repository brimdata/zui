import {SystemTest} from "./system-test"
import {screen, within} from "@testing-library/react"
import fsExtra from "fs-extra"
import os from "os"
import path from "path"
import {dialog} from "electron"

const filePath = path.join(os.tmpdir(), "myQueries.json")
const system = new SystemTest("export-queries")

beforeAll(async () => {
  system.mountApp()
  await system.importFile("sample.tsv")
})

test("clicking the export button", async () => {
  const save = jest.spyOn(dialog, "showSaveDialog")
  save.mockImplementationOnce(() =>
    Promise.resolve({canceled: false, filePath})
  )

  const sidebar = screen.getByRole("complementary", {name: "sidebar"})
  const brimFolder = within(sidebar).getByText("Brim")
  await system.rightClick(brimFolder)
  await system.click("Export Folder as JSON")
  await screen.findByText(/export complete/i)
  expect(fsExtra.statSync(filePath).size).toBe(2888)
  await fsExtra.remove(filePath)
})

test("canceling the export", async () => {
  const save = jest.spyOn(dialog, "showSaveDialog")
  save.mockImplementationOnce(() => Promise.resolve({canceled: true, filePath}))

  const sidebar = screen.getByRole("complementary", {name: "sidebar"})
  const brimFolder = within(sidebar).getByText("Brim")
  await system.rightClick(brimFolder)
  await system.click("Export Folder as JSON")

  expect(await fsExtra.pathExists(filePath)).toBe(false)
})
