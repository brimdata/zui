import {screen, within} from "@testing-library/react"
import fsExtra from "fs-extra"
import os from "os"
import path from "path"
import {SystemTest} from "./system-test"

const filePath = path.join(os.tmpdir(), "myQueries.json")
const system = new SystemTest("export-queries")

beforeAll(async () => {
  system.mountApp()
  await system.importFile("sample.tsv")
})

afterEach(() => {
  fsExtra.removeSync(filePath)
})

test("clicking the export button", async () => {
  const sidebar = screen.getByRole("complementary", {name: "sidebar"})
  const brimFolder = within(sidebar).getByText("Brim")
  await system.rightClick(brimFolder)
  system.mockSaveDialog({canceled: false, filePath})
  await system.click("Export Folder as JSON")
  await screen.findByText("Export Complete")

  expect(fsExtra.statSync(filePath).size).toBe(2888)
})

test("canceling the export", async () => {
  const sidebar = screen.getByRole("complementary", {name: "sidebar"})
  const brimFolder = within(sidebar).getByText("Brim")
  await system.rightClick(brimFolder)
  system.mockSaveDialog({canceled: true, filePath})
  await system.click("Export Folder as JSON")

  expect(await fsExtra.pathExists(filePath)).toBe(false)
})
