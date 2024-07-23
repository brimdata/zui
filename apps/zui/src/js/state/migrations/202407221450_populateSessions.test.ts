import {migrate} from "src/test/unit/helpers/migrate"
import {getAllStates} from "./utils/getTestState"

test("migrating 202407221450_populateSessions", async () => {
  const next = await migrate({state: "v1.17.0", to: "202407221450"})

  const result = {
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

  for (const state of getAllStates(next)) {
    expect(state.query_sessions).toEqual(result)
  }
})
