import {SystemTest} from "./system-test"
import {screen} from "@testing-library/react"

const system = new SystemTest("timers")

test("mount with no timers", async () => {
  system.mountApp()
  await system.importFile("sample.zng")
  console.log("done importing")
  await screen.findByText("Local Lake")
})
