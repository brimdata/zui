import {migrate} from "src/test/unit/helpers/migrate"

const testVersionId = "testVersionId"
jest.mock("@reduxjs/toolkit", () => {
  return {nanoid: () => testVersionId}
})

const expectedQueries = {
  id: "root",
  name: "root",
  isOpen: true,
  items: [
    {
      isOpen: true,
      items: [
        {
          id: "q_bnFu_E9-hF3ostJ81Ql",
          name: "nodes",
          description: "",
          tags: [],
          pins: [],
        },
        {
          isOpen: true,
          items: [
            {
              id: "J36QjMB_j-UgWfNukmz_w",
              name: "nested query",
              description: "test description",
              tags: [],
              pins: [],
            },
          ],
          name: "Nested Folder",
          id: "Z-yaBei5jUVtpgNmkgdLs",
        },
      ],
      name: "Custom Queries",
      id: "QC-SIs9VyfrAxVcpg3Kx4",
    },
  ],
}

const expectedVersions = {
  "q_bnFu_E9-hF3ostJ81Ql": {
    ids: [testVersionId],
    entities: {
      [testVersionId]: {
        version: testVersionId,
        ts: expect.any(String),
        value: "over nodes",
      },
    },
  },
  "J36QjMB_j-UgWfNukmz_w": {
    ids: [testVersionId],
    entities: {
      [testVersionId]: {
        version: testVersionId,
        ts: expect.any(String),
        value: "over nodes | cut id",
      },
    },
  },
}

test("migrating 202206280841_queriesWithVersions", async () => {
  const next = await migrate({state: "v0.30.0", to: "202206280841"})

  expect.assertions(4)

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    expect(state.queries).toMatchObject(expectedQueries)
    expect(state.queryVersions).toMatchObject(expectedVersions)
  }

  expect(next.globalState.queries).toMatchObject(expectedQueries)
  expect(next.globalState.queryVersions).toMatchObject(expectedVersions)
})
