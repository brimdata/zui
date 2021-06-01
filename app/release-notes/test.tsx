import {render, screen} from "@testing-library/react"
import {rest} from "msw"
import React from "react"
import server from "test/unit/server"
import ReleaseNotes from "./release-notes"

server.use(
  rest.get(
    "https://api.github.com/repos/brimdata/brim/releases/tags/v0.0.0",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({body: "Testing Release Notes"}))
    }
  )
)

test("fetches the release notes", async () => {
  render(<ReleaseNotes />)
  await screen.findByText("Testing Release Notes")
})
