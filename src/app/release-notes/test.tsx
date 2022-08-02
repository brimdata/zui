/**
 * @jest-environment jsdom
 */

import React from "react"
import {rest} from "msw"
import {SystemTest} from "src/test/system"
import ReleaseNotes from "./release-notes"
import {screen} from "@testing-library/react"

const system = new SystemTest("release-notes")

system.network.use(
  rest.get(
    "https://api.github.com/repos/brimdata/brim/releases/tags/v0.0.0",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({body: "Testing Release Notes"}))
    }
  )
)

test("fetches the release notes", async () => {
  system.render(<ReleaseNotes />)
  await screen.findByText("Testing Release Notes")
})
