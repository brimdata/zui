import {SystemTest} from "./system-test"
import {act, screen, within} from "@testing-library/react"

const system = new SystemTest("delete-pool")

test("delete the current pool", async () => {
  system.mountApp()
  await system.importFile("sample.zng")
  const pools = await screen.findByRole("navigation", {name: "pools"})
  const pool = await within(pools).findByText("sample.zng")
  system.rightClick(pool)
  const del = await screen.findByText("Delete")
  act(() => system.click(del))
  await screen.findByText(/deleted/i)
}, 20_000)
