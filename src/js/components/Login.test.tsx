/**
 * @jest-environment jsdom
 */
import React from "react"
import {act, screen, waitFor} from "@testing-library/react"
import {shell} from "electron"
import {SystemTest} from "src/test/system"
import url from "url"
import brim from "../brim"
import {defaultLake} from "../initializers/initLakeParams"
import Login from "./Login"
import {rest} from "msw"
import LakeStatuses from "../state/LakeStatuses"

const system = new SystemTest("Login.test.ts")

test("login error", async () => {
  const lake = getLake()
  system.render(<Login lake={lake} />)
  const button = screen.getByRole("button", {name: "Login"})
  system.click(button)

  const state = await expectBrowserToOpen()
  system.silenceNext("error")
  system.main.openUrl(brimErrorUrl(state))

  await screen.findByText(/missing brim_tenant_id or brim_user_id/)
})

test("login success", async () => {
  // Mock the network when requesting the access token
  system.network.use(
    rest.post("http://test.com/oauth/token", (req, res, ctx) => {
      return res(ctx.json({access_token: "access", refresh_token: "refresh"}))
    })
  )

  const lake = getLake()
  system.render(<Login lake={lake} />)
  const button = screen.getByRole("button", {name: "Login"})
  await act(async () => {
    await system.click(button)
  })

  const state = await expectBrowserToOpen()
  system.main.openUrl(brimSuccessUrl(state))

  await waitFor(() =>
    expect(system.select(LakeStatuses.get(lake.id))).toBe("connected")
  )
})

/**
 * Helper functions
 */

const brimErrorUrl = (state) =>
  `brim://auth/auth0/callback?error=unauthorized&error_description=brim%20validation%20error%3A%20missing%20brim_tenant_id%20or%20brim_user_id&state=${state}`

const brimSuccessUrl = (state) =>
  `//brim://auth/auth0/callback?code=SemkqWmI3Tv_NWaI&state=${state}`

function getLake() {
  return brim.lake({
    ...defaultLake(),
    authType: "auth0",
    authData: {
      audience: "test",
      domain: "http://test.com",
      accessToken: "test",
      clientId: "hi",
    },
  })
}

async function expectBrowserToOpen() {
  await waitFor(() =>
    expect(shell.openExternal).toHaveBeenCalledWith(
      expect.stringContaining("http://test.com/authorize?")
    )
  )
  const auth0Url = (shell.openExternal as jest.Mock).mock.calls[0][0]
  const urlParts = url.parse(auth0Url, true)
  return urlParts.query.state
}
