import { flatRecords } from "./flatRecords.ts";
import { test, assertEquals } from "../test/helper/mod.ts";
import { SearchRecordsPayload } from "../types.ts";

test("flatRecords triple nested", () => {
  const fn = flatRecords();
  const input: SearchRecordsPayload = {
    type: "SearchRecords",
    flat_records: [],
    flat_types: {},
    records: [
      {
        id: 1,
        type: [
          {
            name: "three",
            type: [{ name: "two", type: [{ name: "one", type: "ggg" }] }],
          },
          { name: "two", type: [{ name: "one", type: "gg" }] },
          { name: "one", type: "g" },
        ],
        values: [[["321"]], ["21"], "1"],
      },
    ],
  };

  const output = fn(input);
  if (output.type === "SearchRecords") {
    assertEquals(
      output.flat_types[1],
      [
        { name: "three.two.one", type: "ggg" },
        { name: "two.one", type: "gg" },
        { name: "one", type: "g" },
      ],
    );
  } else {
    throw new Error("Expected SearchRecords");
  }
});
