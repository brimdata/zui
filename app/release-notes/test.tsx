/**
 * @jest-environment jsdom
 */

import {rest} from "msw"
import React from "react"
import server from "test/unit/helpers/server"
import {setupBrim} from "test/unit/helpers/setup-brim"
import {render, screen} from "test/unit/helpers"
import ReleaseNotes from "./release-notes"

const brim = setupBrim()

server.use(
  rest.get(
    "https://api.github.com/repos/brimdata/brim/releases/tags/v0.0.0",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({body: "Testing Release Notes"}))
    }
  )
)

test("fetches the release notes", async () => {
  render(<ReleaseNotes />, {store: brim.store})
  await screen.findByText("Testing Release Notes")
})
