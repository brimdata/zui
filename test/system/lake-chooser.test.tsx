import React from "react"
import {screen} from "@testing-library/react"
import App from "src/js/components/App"
import {SystemTest} from "./system-test"

const system = new SystemTest("lake-chooser")

test("visiting a lake that doesn't exist", async () => {
  system.navTo("/lakes/none")
  system.render(<App />)
  await screen.findByRole("heading", {name: /Choose a Lake/})
})
