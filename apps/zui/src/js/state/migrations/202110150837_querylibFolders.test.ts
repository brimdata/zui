import {migrate} from "src/test/unit/helpers/migrate"
import {getAllStates} from "./utils/getTestState"

test("migrating 202110150837_querylibFolders", async () => {
  const next = await migrate({state: "v0.26.0", to: "202110150837"})

  expect.assertions(2)

  const newLibState = {
    id: "root",
    name: "root",
    items: [
      {
        name: "Custom Queries",
        id: expect.any(String),
        isOpen: true,
        items: [
          {
            id: expect.any(String),
            name: "Unique DNS Queries (Edited)",
            value: '_path=="dns" | count() by query | sort -r',
            description:
              "Shows all unique DNS queries contained in the data set with count",
            tags: ["dns", "initial exploration"],
          },
          {
            id: expect.any(String),
            value: "count() by alert.signature",
            name: "Custom alert signature counts",
            description: "count of alert signatures",
            tags: ["security"],
          },
        ],
      },
    ],
  }

  for (const state of getAllStates(next)) {
    expect(state.queries).toEqual(newLibState)
  }
})
