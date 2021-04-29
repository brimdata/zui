import tabHistory from "app/router/tab-history"
import {workspacePath} from "app/router/utils/paths"
import {createZealotMock} from "zealot"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Workspaces from "../state/Workspaces"
import fixtures from "../test/fixtures"
import initTestStore from "../test/initTestStore"
import {itestFile} from "../test/itestFile"
import ingestFiles from "./ingestFiles"
import BrimApi from "../api"
import {mocked} from "ts-jest/utils"

jest.mock("../api")

let store, zealot, apiMock
beforeEach(() => {
  zealot = createZealotMock()
    .stubPromise("spaces.create", {
      name: "sample.pcap.brim",
      id: "spaceId"
    })
    .stubPromise(
      "spaces.get",
      {
        name: "sample.pcap.brim",
        id: "spaceId",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1}
      },
      "always"
    )
    .stubPromise("spaces.delete", true)
  const ws = fixtures("workspace1")

  apiMock = mocked(BrimApi)
  apiMock.loaders = {
    getMatches: jest.fn()
  }

  store = initTestStore(zealot.zealot, apiMock)
  store.dispatchAll([Workspaces.add(ws)])
  store.dispatch(tabHistory.push(workspacePath(ws.id)))
})

describe("success case", () => {
  beforeEach(() => {
    apiMock.loaders.getMatches.mockReturnValueOnce([
      {
        load: (params, onProgressUpdate, onWarning, onDetailUpdate) => {
          onDetailUpdate()
          onProgressUpdate(null)
        },
        match: "test"
      }
    ])
  })

  test("opening a pcap", async () => {
    await store.dispatch(ingestFiles([itestFile("sample.pcap")]))

    const state = store.getState()
    expect(Tab.getSpaceName(state)).toEqual("sample.pcap.brim")
    expect(Current.mustGetSpace(state)).toEqual(
      expect.objectContaining({
        name: "sample.pcap.brim",
        id: "spaceId",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1},
        ingest: {
          progress: null,
          warnings: [],
          snapshot: 0
        }
      })
    )
  })

  test("register a handler with a space id", async () => {
    await store.dispatch(ingestFiles([itestFile("sample.pcap")]))

    const handler = store
      .getActions()
      .find((a) => a.type === "HANDLERS_REGISTER")

    expect(handler).toEqual({
      type: "HANDLERS_REGISTER",
      handler: {type: "INGEST", spaceId: "spaceId"},
      id: expect.any(String)
    })
  })

  test("a zeek ingest error", async () => {
    apiMock.loaders.getMatches.mockReset()
    apiMock.loaders.getMatches.mockReturnValueOnce([
      {
        load: () => {
          throw new Error("Boom")
        },
        match: "test"
      }
    ])

    await expect(
      store.dispatch(ingestFiles([itestFile("sample.tsv")]))
    ).rejects.toEqual(expect.any(Error))

    const state = store.getState()
    expect(Current.getSpaceId(state)).toEqual(null)
  })
})

describe("error case", () => {
  test("task end error", async () => {
    apiMock.loaders.getMatches.mockReturnValueOnce([
      {
        load: () => {
          throw new Error("Boom")
        },
        match: "test"
      }
    ])
    await expect(
      store.dispatch(ingestFiles([itestFile("sample.pcap")]))
    ).rejects.toEqual(expect.any(Error))

    const state = store.getState()
    const workspace = Current.getWorkspaceId(state)
    expect(Spaces.getSpaces(workspace)(state)).toEqual([])
    expect(Spaces.getSpaces(workspace)(state)).toEqual([])
    expect(Current.getSpaceId(state)).toEqual(null)
  })

  test("pcap post warning", async () => {
    apiMock.loaders.getMatches.mockReturnValueOnce([
      {
        load: (_, __, onWarning) => {
          onWarning("Some pcap warning")
        },
        match: "test"
      }
    ])

    await store.dispatch(ingestFiles([itestFile("sample.pcap")]))

    const state = store.getState()
    const wsId = Current.getWorkspaceId(state)
    const spaceId = Current.getSpaceId(state)
    expect(Spaces.getIngestWarnings(wsId, spaceId)(state)).toEqual([
      "Some pcap warning"
    ])
  })
})
