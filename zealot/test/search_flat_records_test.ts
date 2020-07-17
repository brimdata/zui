import { join } from "https://deno.land/std/path/mod.ts";
import { testApi, assertEquals } from "../test/helper/mod.ts";
import { flatRecords } from "../enhancers/flatRecords.ts";
import { Zealot } from "../types.ts";

async function setup(zealot: Zealot) {
  const space = await zealot.spaces.create({ name: "space1" });
  const log = join(Deno.cwd(), "test/data/sample.tsv");
  const resp = await zealot.logs.post({ paths: [log], spaceId: space.id });
  await resp.array();

  zealot.setSearchOptions(
    {
      spaceId: space.id,
      from: new Date(0),
      to: new Date(),
      enhancers: [flatRecords],
    },
  );
}

testApi("flatRecords::types", async (zealot) => {
  await setup(zealot);
  const resp = await zealot.search("_path=conn");
  const payloads = await resp.array();

  if (payloads[1].type === "SearchRecords") {
    const idField = payloads[1].flat_types[26][3];
    assertEquals(idField, { name: "id.orig_h", type: "ip" });
  } else {
    throw new Error("Expected SearchRecords");
  }
});
