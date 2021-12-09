import {screen} from "@testing-library/react"
import {SystemTest} from "./system-test"

const system = new SystemTest("lake-chooser")

test("visiting a lake that doesn't exist", async () => {
  system.navTo("/workspaces/none")
  system.mountApp()
  await screen.findByRole("heading", {name: /Choose a Workspace/})
})
