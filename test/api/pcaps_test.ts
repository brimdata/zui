import {testApi, testFile, assertEquals, createTime} from "./helper/mod.ts"

async function setup(zealot: any) {
  const space = await zealot.spaces.create({name: "my-pcaps"})
  const path = testFile("sample.pcap")
  const resp = await zealot.pcaps.post({spaceId: space.id, path})
  await resp.array()
  zealot.setSearchOptions({
    spaceId: space.id,
    from: new Date(0),
    to: new Date()
  })
  return space
}

testApi("PCAPS download", async (zealot: any) => {
  const {id} = await setup(zealot)
  const stream = await zealot.search("_path=conn | sort ts | head 1")
  const [first] = await stream.records()
  const ts = createTime(first.get("ts").toString())
  const dur = createTime(first.get("duration").toString())
  const {sec: ts_sec, ns: ts_ns} = ts.toTs()
  const {sec: duration_sec, ns: duration_ns} = dur.toTs()
  const proto = first.get("proto").toString()
  const flow = first.get("id") as any
  const src_host = flow.get("orig_h").toString()
  const src_port = flow.get("orig_p").toString()
  const dst_host = flow.get("resp_h").toString()
  const dst_port = flow.get("resp_p").toString()
  const spaceId = id

  const resp = await zealot.pcaps.get({
    ts_sec,
    ts_ns,
    duration_sec,
    duration_ns,
    proto,
    src_host,
    src_port,
    dst_host,
    dst_port,
    spaceId
  })

  assertEquals(resp.constructor.name, "Response")

  const bin = await resp.blob()
  assertEquals(bin.size, 6755)
})
