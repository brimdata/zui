import {SystemTest} from "./system-test"
import {screen} from "@testing-library/react"

const system = new SystemTest("histogram")

test("histogram deep inspection", async () => {
  system.mountApp()
  await system.importFile("sample.zng")
  await system.runQuery("")
  const histogram = await screen.findByTestId("histogram")

  expect(histogram.querySelectorAll("rect").length).toBeGreaterThan(10)
})
