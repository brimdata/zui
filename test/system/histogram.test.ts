import {SystemTest} from "./system-test"
import {screen, waitFor} from "@testing-library/react"

const system = new SystemTest("histogram")

test("histogram deep inspection", async () => {
  system.mountApp()
  await system.importFile("sample.zng")
  await system.runQuery("", "Histogram")
  const histogram = await screen.findByTestId("histogram")
  await waitFor(() =>
    expect(histogram.querySelectorAll("rect").length).toBeGreaterThan(0)
  )
  console.log("test is done")
})
