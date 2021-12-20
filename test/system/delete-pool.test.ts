import {SystemTest} from "./system-test"
import {act, screen, within} from "@testing-library/react"
import env from "app/core/env"

const system = new SystemTest("delete-pool")

test("delete the current pool", async () => {
  if (env.isWindows) return // We are not going to test this on windows
  system.mountApp()
  await system.importFile("sample.zng")
  const pools = await screen.findByRole("navigation", {name: "pools"})
  const pool = await within(pools).findByText("sample.zng")
  system.rightClick(pool)
  const del = await screen.findByText("Delete")
  act(() => system.click(del))
  await screen.findByText(/deleted/i)
})
