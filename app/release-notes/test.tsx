import "@testing-library/jest-dom"
import {render, screen} from "@testing-library/react"
import {rest} from "msw"
import {setupServer} from "msw/node"
import React from "react"
import ReleaseNotes from "./release-notes"

const server = setupServer(
  rest.get(
    "https://api.github.com/repos/brimdata/brim/releases/tags/*",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({body: "Testing Release Notes"}))
    }
  )
)

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

test("fetches the release notes", async () => {
  render(<ReleaseNotes />)
  await screen.findByText("Testing Release Notes")
})
