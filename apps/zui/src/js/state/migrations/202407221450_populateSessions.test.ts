import {migrate} from "src/test/unit/helpers/migrate"
import {getAllStates} from "./utils/getTestState"

test("migrating 202407221450_populateSessions", async () => {
  const next = await migrate({state: "v1.17.0", to: "202407221450"})

  const sessions = {
    entities: {
      KbZNe9FuSHnKKfB398B0Z: {
        id: "KbZNe9FuSHnKKfB398B0Z",
        name: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      Zf8vsxTZ4mqT7IK1OtvRf: {
        id: "Zf8vsxTZ4mqT7IK1OtvRf",
        name: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      sIpManYfhNgo6gWdu10bA: {
        id: "sIpManYfhNgo6gWdu10bA",
        name: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    },
    ids: [
      "KbZNe9FuSHnKKfB398B0Z",
      "sIpManYfhNgo6gWdu10bA",
      "Zf8vsxTZ4mqT7IK1OtvRf",
    ],
  }

  const histories = {
    KbZNe9FuSHnKKfB398B0Z: [
      {
        queryId: "KbZNe9FuSHnKKfB398B0Z",
        version: "mDbO6knM4vakcKQ0u4CLv",
      },
    ],
    Zf8vsxTZ4mqT7IK1OtvRf: [
      {
        queryId: "Zf8vsxTZ4mqT7IK1OtvRf",
        version: "88LzM379511XaOMGPKkHB",
      },
      {
        queryId: "Zf8vsxTZ4mqT7IK1OtvRf",
        version: "YXX7LtHVgCJRgJPNR-USP",
      },
    ],
    sIpManYfhNgo6gWdu10bA: [
      {
        queryId: "sIpManYfhNgo6gWdu10bA",
        version: "BQS4GdEC5JcgV1fankooP",
      },
    ],
  }

  for (const state of getAllStates(next)) {
    expect(state.querySessions).toEqual(sessions)
    expect(state.sessionHistories).toEqual(histories)
  }
})
