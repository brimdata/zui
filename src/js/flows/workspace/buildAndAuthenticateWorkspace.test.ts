import {ipcRenderer, remote} from "electron"
import jwtDecode from "jwt-decode"
import Workspaces from "src/js/state/Workspaces"
import WorkspaceStatuses from "src/js/state/WorkspaceStatuses"
import {mocked} from "ts-jest/utils"
import {createZealotMock} from "zealot"
import Auth0Client from "../../auth0"
import {AuthType} from "../../state/Workspaces/types"
import initTestStore from "../../test/initTestStore"
import {
  buildAndAuthenticateWorkspace,
  ConnectionError,
  LoginError
} from "./buildAndAuthenticateWorkspace"

jest.mock("jwt-decode")
jest.mock("../../auth0")
jest.mock("electron", () => ({
  ipcRenderer: {
    invoke: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn()
  },
  remote: {
    dialog: {
      showMessageBox: jest.fn()
    }
  }
}))

const fxt = {
  secureMethodAuth: {
    kind: "auth0",
    auth0: {
      client_id: "testClientId",
      domain: "testDomain"
    }
  },
  publicMethodAuth: {
    kind: "none"
  },
  newWorkspace: {
    id: "1",
    name: "testWorkspaceName",
    host: "testHost",
    port: "testPort"
  },
  accessToken: "testAccessToken",
  refreshToken: "testRefreshToken",
  validDate: Math.floor(Date.now() / 1000 + 60),
  expiredDate: Math.floor(Date.now() / 1000 - 60),
  version: {version: "1"}
}

let store, zealot, ctl
let auth0ClientMock, jwtDecodeMock, ipcRendererMock, remoteMock
beforeEach(() => {
  auth0ClientMock = mocked(Auth0Client)
  jwtDecodeMock = mocked(jwtDecode)
  remoteMock = mocked(remote)
  ipcRendererMock = mocked(ipcRenderer)

  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  ctl = new AbortController()
})

const expectWorkspace = (ws, status) => {
  const state = store.getState()
  expect(Workspaces.id(ws.id)(state)).toEqual(ws)
  expect(WorkspaceStatuses.get(ws.id)(state)).toEqual(status)
}

describe("success cases", () => {
  beforeEach(() => {
    zealot
      .stubPromise("version", fxt.version)
      .stubPromise("spaces.list", [{name: "dataSpace", id: "1"}], "always")
  })

  test("new public workspace", async () => {
    zealot.stubPromise("authMethod", fxt.publicMethodAuth)

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fxt.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    expectWorkspace(
      {
        ...fxt.newWorkspace,
        ...fxt.version,
        authType: "none"
      },
      "connected"
    )
  })

  test("existing public workspace, updated version", async () => {
    const existingWs = {
      ...fxt.newWorkspace,
      version: "0",
      authType: "none" as AuthType
    }
    store.dispatch(Workspaces.add(existingWs))
    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(existingWs, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    expectWorkspace(
      {
        ...existingWs,
        ...fxt.version
      },
      "connected"
    )
  })

  test("existing secure workspace -> valid token from secrets", async () => {
    const existingWs = {
      ...fxt.newWorkspace,
      ...fxt.version,
      authType: "auth0" as AuthType,
      authData: {
        clientId: fxt.secureMethodAuth.auth0.client_id,
        domain: fxt.secureMethodAuth.auth0.domain
      }
    }
    store.dispatch(Workspaces.add(existingWs))
    ipcRendererMock.invoke.mockReturnValueOnce(fxt.accessToken)
    jwtDecodeMock.mockReturnValueOnce({
      exp: fxt.validDate
    })

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(existingWs, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    expectWorkspace(
      {
        ...existingWs,
        authData: {...existingWs.authData, accessToken: fxt.accessToken}
      },
      "connected"
    )
  })

  test("existing secure workspace -> no token -> succeed refresh", async () => {
    const existingWs = {
      ...fxt.newWorkspace,
      ...fxt.version,
      authType: "auth0" as AuthType,
      authData: {
        clientId: fxt.secureMethodAuth.auth0.client_id,
        domain: fxt.secureMethodAuth.auth0.domain
      }
    }
    store.dispatch(Workspaces.add(existingWs))
    // no access token in secrets
    ipcRendererMock.invoke.mockReturnValueOnce("")
    // do have refresh token though
    ipcRendererMock.invoke.mockReturnValueOnce(fxt.refreshToken)
    auth0ClientMock.mockImplementationOnce(() => ({
      refreshAccessToken: jest.fn().mockReturnValueOnce(fxt.accessToken)
    }))

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(existingWs, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    expectWorkspace(
      {
        ...existingWs,
        authData: {...existingWs.authData, accessToken: fxt.accessToken}
      },
      "connected"
    )
  })

  test("existing secure workspace -> expired token -> succeed refresh", async () => {
    const existingWs = {
      ...fxt.newWorkspace,
      ...fxt.version,
      authType: "auth0" as AuthType,
      authData: {
        clientId: fxt.secureMethodAuth.auth0.client_id,
        domain: fxt.secureMethodAuth.auth0.domain
      }
    }
    store.dispatch(Workspaces.add(existingWs))
    ipcRendererMock.invoke.mockReturnValueOnce("expiredToken")
    jwtDecodeMock.mockReturnValueOnce({exp: fxt.expiredDate})
    ipcRendererMock.invoke.mockReturnValueOnce(fxt.refreshToken)
    auth0ClientMock.mockImplementationOnce(() => ({
      refreshAccessToken: jest.fn().mockReturnValueOnce(fxt.accessToken)
    }))

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(existingWs, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    expectWorkspace(
      {
        ...existingWs,
        authData: {...existingWs.authData, accessToken: fxt.accessToken}
      },
      "connected"
    )
  })

  test("new secure workspace -> login required -> cancel dialog", async () => {
    zealot.stubPromise("authMethod", fxt.secureMethodAuth)
    ipcRendererMock.invoke.mockReturnValueOnce("")
    ipcRendererMock.invoke.mockReturnValueOnce("")
    remoteMock.dialog.showMessageBox.mockReturnValueOnce({response: 1})

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fxt.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(true)
    expect(error).toBeNull()
    expect(Workspaces.all(store.getState())).toHaveLength(0)
  })

  test("new secure workspace -> login required -> abort login", async () => {
    zealot.stubPromise("authMethod", fxt.secureMethodAuth)
    ipcRendererMock.invoke.mockReturnValueOnce("")
    ipcRendererMock.invoke.mockReturnValueOnce("")
    remoteMock.dialog.showMessageBox.mockReturnValueOnce({response: 0})

    setTimeout(() => ctl.abort(), 20)
    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fxt.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(true)
    expect(error).toBeNull()
    expect(Workspaces.all(store.getState())).toHaveLength(0)
  })

  test("new secure workspace -> login required -> succeed login", async () => {
    zealot.stubPromise("authMethod", fxt.secureMethodAuth)
    ipcRendererMock.invoke.mockReturnValueOnce("")
    ipcRendererMock.invoke.mockReturnValueOnce("")
    remoteMock.dialog.showMessageBox.mockReturnValueOnce({response: 0})
    ipcRendererMock.once = async (_channel, handleAuthCb) => {
      await handleAuthCb("mockEvent", {
        workspaceId: fxt.newWorkspace.id,
        code: "mockCode"
      })
    }
    auth0ClientMock.mockImplementationOnce(() => ({
      openLoginUrl: jest.fn(),
      exchangeCode: jest.fn().mockReturnValueOnce({
        accessToken: fxt.accessToken,
        refreshToken: fxt.refreshToken
      })
    }))

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fxt.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeNull()
    const {domain, client_id: clientId} = fxt.secureMethodAuth.auth0
    expectWorkspace(
      {
        ...fxt.newWorkspace,
        ...fxt.version,
        authType: fxt.secureMethodAuth.kind,
        authData: {clientId, domain, accessToken: fxt.accessToken}
      },
      "connected"
    )
  })
})

describe("failure cases", () => {
  test("new generic workspace -> connection failure", async () => {
    // no version mock setup -> connection error
    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fxt.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeInstanceOf(ConnectionError)
    expect(Workspaces.all(store.getState())).toHaveLength(0)
  })

  test("new secure workspace -> login required -> login failure", async () => {
    zealot.stubPromise("version", fxt.version)
    zealot.stubPromise("authMethod", fxt.secureMethodAuth)
    ipcRendererMock.invoke.mockReturnValueOnce("")
    ipcRendererMock.invoke.mockReturnValueOnce("")
    remoteMock.dialog.showMessageBox.mockReturnValueOnce({response: 0})
    ipcRendererMock.once = async (_channel, handleAuthCb) => {
      await handleAuthCb("mockEvent", {
        workspaceId: fxt.newWorkspace.id,
        // no code, login failed
        code: undefined
      })
    }
    auth0ClientMock.mockImplementationOnce(() => ({
      openLoginUrl: jest.fn()
    }))

    const [cancelled, error] = await store.dispatch(
      buildAndAuthenticateWorkspace(fxt.newWorkspace, ctl.signal)
    )

    expect(cancelled).toEqual(false)
    expect(error).toBeInstanceOf(LoginError)
    expect(Workspaces.all(store.getState())).toHaveLength(0)
  })
})
