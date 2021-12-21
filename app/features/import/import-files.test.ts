import tabHistory from "app/router/tab-history"
import {workspacePath} from "app/router/utils/paths"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import Tab from "src/js/state/Tab"
import Lakes from "src/js/state/Lakes"
import data from "test/shared/data"
import fixtures from "test/unit/fixtures"
import initTestStore from "test/unit/helpers/initTestStore"
import {mocked} from "ts-jest/utils"
import {createZealotMock} from "zealot-old"
import BrimApi from "src/js/api"
import ingestFiles from "./import-files"

jest.mock("src/js/api")

let store, zealot, apiMock
beforeEach(() => {
  zealot = createZealotMock()
    .stubPromise("pools.create", {
      pool: {
        name: "sample.pcap.brim",
        id: "poolId"
      },
      branch: {
        name: "main"
      }
    })
    .stubPromise(
      "pools.get",
      {
        name: "sample.pcap.brim",
        id: "poolId"
      },
      "always"
    )
    .stubPromise(
      "pools.stats",
      {
        span: {
          ts: 0n,
          dur: 1_000_000_001n
        }
      },
      "always"
    )
    .stubPromise("pools.delete", true)
  const ws = fixtures("workspace1")

  apiMock = mocked(BrimApi)
  apiMock.loaders = {
    getMatches: jest.fn(),
    abort: jest.fn(),
    setAbortHandler: () => jest.fn(),
    didAbort: jest.fn(),
    requestAbort: jest.fn()
  }

  store = initTestStore(zealot.zealot, apiMock)
  store.dispatchAll([Lakes.add(ws)])
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
    await store.dispatch(ingestFiles([data.getDOMFile("sample.pcap")]))

    const state = store.getState()
    expect(Tab.getPoolName(state)).toEqual("sample.pcap.brim")
    expect(Current.mustGetPool(state)).toEqual(
      expect.objectContaining({
        name: "sample.pcap.brim",
        id: "poolId",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1},
        ingest: {
          progress: null,
          warnings: []
        }
      })
    )
  })

  test("register a handler with a space id", async () => {
    await store.dispatch(ingestFiles([data.getDOMFile("sample.pcap")]))

    const handler = store
      .getActions()
      .find((a) => a.type === "HANDLERS_REGISTER")

    expect(handler).toEqual({
      type: "HANDLERS_REGISTER",
      handler: {type: "INGEST", poolId: "poolId"},
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
      store.dispatch(ingestFiles([data.getDOMFile("sample.tsv")]))
    ).rejects.toEqual(expect.any(Error))

    const state = store.getState()
    expect(Current.getPoolId(state)).toEqual(null)
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
      store.dispatch(ingestFiles([data.getDOMFile("sample.pcap")]))
    ).rejects.toEqual(expect.any(Error))

    const state = store.getState()
    const workspace = Current.getWorkspaceId(state)
    expect(Pools.getPools(workspace)(state)).toEqual([])
    expect(Pools.getPools(workspace)(state)).toEqual([])
    expect(Current.getPoolId(state)).toEqual(null)
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

    await store.dispatch(ingestFiles([data.getDOMFile("sample.pcap")]))

    const state = store.getState()
    const wsId = Current.getWorkspaceId(state)
    const poolId = Current.getPoolId(state)
    expect(Pools.getIngestWarnings(wsId, poolId)(state)).toEqual([
      "Some pcap warning"
    ])
  })
})
