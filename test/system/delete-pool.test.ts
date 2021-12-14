import {SystemTest} from "./system-test"
import {screen, within} from "@testing-library/react"

const system = new SystemTest("delete-pool")

test("delete the current pool", async () => {
  system.mountApp()
  await system.importFile("sample.zng")
  const pools = await screen.findByRole("navigation", {name: "pools"})
  const pool = await within(pools).findByText("sample.zng")
  await system.rightClick(pool)
  await system.click("Delete")
  await screen.findByText(/deleted/i)
}, 20_000)
