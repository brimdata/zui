import {
  spy,
  testApi,
  assertEquals,
  assert,
  assertCalledWith,
} from "./helper/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { Zealot } from "../types.ts";
import { uniq } from "../util/utils.ts";
import { zngToZeek, flatRecords, totalRecords } from "../enhancers/mod.ts";

async function setup(zealot: Zealot) {
  const space = await zealot.spaces.create({ name: "space1" });
  const log = join(Deno.cwd(), "test/data/sample.tsv");
  const resp = await zealot.logs.post({ paths: [log], spaceId: space.id });
  await resp.array();

  zealot.setSearchOptions(
    { spaceId: space.id, from: new Date(0), to: new Date(), enhancers: [] },
  );
}

testApi("search#records", async (zealot) => {
  await setup(zealot);

  const resp = await zealot.search("* | sort ts");
  const results = await resp.records();

  assertEquals(results.length, 30);
  assertEquals(
    // @ts-ignore
    results[0].type.splice(0, 2),
    [{ name: "_path", type: "string" }, { name: "ts", type: "time" }],
  );
  assertEquals(results[0].id, 39);
  assertEquals(results[0].values.splice(0, 2), ["stats", "1582646585.983635"]);
});

testApi("search#iterator", async (zealot) => {
  await setup(zealot);

  const stream = await zealot.search("* | sort ts");
  const types = [];
  for await (const payload of stream) {
    types.push(payload.type);
  }

  assertEquals(
    uniq(types),
    ["TaskStart", "SearchRecords", "SearchEnd", "SearchStats", "TaskEnd"],
  );
});

testApi("search#callbacks start and end", async (zealot) => {
  await setup(zealot);
  const resp = await zealot.search("*");
  const start = spy();
  const end = spy();

  await new Promise((resolve, reject) => {
    resp.callbacks()
      .start(start)
      .end((args: any) => {
        end(args);
        resolve();
      })
      .error(reject);
  });

  assertCalledWith(start, { task_id: 0, type: "TaskStart" });
  assertCalledWith(end, { task_id: 0, type: "TaskEnd" });
});

testApi("search#callbacks record", async (zealot) => {
  await setup(zealot);
  const resp = await zealot.search("_path=conn | sort ts | head 1");
  const records = spy();

  await new Promise((resolve, reject) => {
    resp.callbacks().records(records).end(resolve).error(reject);
  });

  assertEquals(
    records.calls[0].args[0].records[0].values.splice(0, 2),
    ["conn", "1582646585.983635"],
  );
});

testApi("search#originResponse format=zng", async (zealot) => {
  await setup(zealot);
  const resp = await zealot.search(
    "*",
    { format: "zng", controlMessages: false },
  );
  // @ts-ignore
  for await (const chunk of resp.origResp.body) {
    assertEquals(chunk instanceof Uint8Array, true);
  }
});

testApi("search#flat_records", async (zealot) => {
  await setup(zealot);
  const resp = await zealot.search(
    "_path=conn | sort ts | head 1",
    { enhancers: [flatRecords] },
  );
  const records = spy();

  await new Promise((resolve, reject) => {
    resp.callbacks().records(records).end(resolve).error(reject);
  });

  const firstRecord = records.calls[0].args[0].flat_records[0][0];
  const firstType: any = Object.values(records.calls[0].args[0].flat_types)[0];
  assertEquals(firstRecord, { name: "_path", type: "string", value: "conn" });
  assertEquals(firstType[0], { name: "_path", type: "string" });
  assertEquals(firstType.length, 22);
});

testApi("search#abort", async (zealot) => {
  await setup(zealot);
  /* Even though abort is called here, it appears the request is still going through.
     This may just be a bug with the Deno implementation. Calling abort should throw
     an AbortError in the fetch promise, but I don't see that happening here. */
  const resp = await zealot.search("*");
  resp.abort();
  await resp.array();
});

testApi("search#transformZeek", async (zealot) => {
  await setup(zealot);
  const resp = await zealot.search("* | sort ts", { enhancers: [zngToZeek] });
  const records = await resp.records();

  // @ts-ignore
  const uniqTypes = uniq(records[0].type.map((t: { type: string }) => t.type));
  assertEquals(uniqTypes, ["string", "time", "count", "interval"]);
});

testApi("search#total_records", async (zealot) => {
  await setup(zealot);

  const resp = await zealot.search("*", { enhancers: [totalRecords] });
  const payloads = await resp.array();
  const taskEnd = payloads[payloads.length - 1];

  assertEquals(taskEnd.type, "TaskEnd");
  // @ts-ignore
  assertEquals(taskEnd.total_records, 30);
});
