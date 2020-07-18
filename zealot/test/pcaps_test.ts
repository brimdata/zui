import { testApi, testFile, assertEquals, assert } from "./helper/mod.ts";
import { Zealot, FlatRecord } from "../types.ts";
import { createTime } from "../util/time.ts";

const createGetter = (record: FlatRecord) =>
  (name: string): string => {
    const field = record.find(((f) => f.name === name));
    if (!field) throw new Error();
    return field.value;
  };

async function setup(zealot: Zealot) {
  const space = await zealot.spaces.create({ name: "my-pcaps" });
  const path = testFile("sample.pcap");
  const resp = await zealot.pcaps.post({ spaceId: space.id, path });
  await resp.array();
  zealot.setSearchOptions(
    { spaceId: space.id, from: new Date(0), to: new Date() },
  );
  return space;
}

testApi("PCAPS download", async (zealot) => {
  const { id } = await setup(zealot);
  const stream = await zealot.search("_path=conn | sort ts | head 1");
  const records = await stream.flatRecords();
  const get = createGetter(records[0]);
  const ts = createTime(get("ts"));
  const dur = createTime(get("duration"));
  const { sec: ts_sec, ns: ts_ns } = ts.toTs();
  const { sec: duration_sec, ns: duration_ns } = dur.toTs();
  const proto = get("proto");
  const src_host = get("id.orig_h");
  const src_port = get("id.orig_p");
  const dst_host = get("id.resp_h");
  const dst_port = get("id.resp_p");
  const spaceId = id;

  const resp = await zealot.pcaps
    .get({
      ts_sec,
      ts_ns,
      duration_sec,
      duration_ns,
      proto,
      src_host,
      src_port,
      dst_host,
      dst_port,
      spaceId,
    });

  assertEquals(resp.constructor.name, "Response");

  const bin = await resp.blob();
  assertEquals(bin.size, 6755);
});
