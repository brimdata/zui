/**
 * @jest-envrionment jsdom
 */

import "src/test/system/real-paths"
import {rest} from "msw"
import {setupServer} from "msw/node"
import {getLatestVersion} from "./autoUpdater"

// @ts-ignore
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
}

const server = setupServer(
  rest.get(
    "https://update.electronjs.org/brimdata/brim/darwin-x64/0.0.0",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({name: "0.0.1"}))
    }
  )
)

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

test("get latest version", async () => {
  const version = await getLatestVersion("brimdata/brim")
  expect(version).toBe("0.0.1")
})
