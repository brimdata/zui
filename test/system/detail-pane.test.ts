import {screen, waitForElementToBeRemoved, within} from "@testing-library/react"
import {toLower} from "lodash"
import {SystemTest} from "./system-test"

const system = new SystemTest("detail-pane")

beforeAll(async () => {
  system.mountApp()
  await system.importFile("ifconfig.zng")
  await system.runQuery("")
  await screen.findAllByRole("cell")
  const view = await screen.findByRole("button", {name: "View"})
  await system.click(view)
  await system.click("Right Pane")
  await screen.findByText("No Log Selected")
})

test("the truth", async () => {})
const FIELDS = "fields"
const UID = "correlation"
const ALERTS = "related alerts"
const HISTORY = "conn history"
const CONNECTIONS = "related connections"
const MD5 = "md5 correlation"

// Helper function to perform the common actions
async function testDetailHeaders(path, sectionNames) {
  const table = await screen.findByRole("table", {name: "results"})
  await system.click(within(table).getAllByText(path)[0])
  const details = await screen.findByRole("complementary", {name: "details"})
  const sections = await within(details).findAllByRole("heading")
  const headers = await Promise.all(sections.map((s) => s.textContent))

  expect(headers.map(toLower)).toEqual(expect.arrayContaining(sectionNames))
}

test("for capture loss", () => {
  return testDetailHeaders("capture_loss", [FIELDS])
})

test("for stats", () => {
  return testDetailHeaders("stats", [FIELDS])
})

test("for alert", () => {
  return testDetailHeaders("alert", [FIELDS, ALERTS, CONNECTIONS])
})

test("for file", () => {
  return testDetailHeaders("files", [FIELDS, MD5])
})

test("for http", () => {
  return testDetailHeaders("files", [FIELDS, UID])
})

test("for conn", () => {
  return testDetailHeaders("conn", [FIELDS, UID, HISTORY])
})
