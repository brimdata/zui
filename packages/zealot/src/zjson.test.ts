import {zq} from "./test/zq"
import {ZedContext} from "./zed/context"
import {TypeValue} from "./zed/index"

const file = "testdata/sample.zson" // data.getPath("sample.zson");

test("decode, then encode", async () => {
  const input = await zq({file, format: "zjson"})
  const ctx = new ZedContext()
  const decoded = ctx.decode(input)
  const encoded = ctx.encode(decoded)

  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i])
  }
})

test("decode, then encode a fused input", async () => {
  const input = await zq({query: "fuse", file, format: "zjson"})
  const ctx = new ZedContext()
  const decoded = ctx.decode(input)
  const encoded = ctx.encode(decoded)

  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i])
  }
})

test("decode, encode with type values", async () => {
  const input = await zq({
    query: "* | count() by typeof(.) | sort count, typeof",
    file,
    format: "zjson"
  })
  const ctx = new ZedContext()

  expect(ctx.encode(ctx.decode(input))).toEqual(input)
})

test("types from one search are the same", async () => {
  const ctx = new ZedContext()
  const groupBy = await zq({
    query: "* | count() by typeof(.) | sort count, typeof",
    file,
    format: "zjson"
  })
  const list = await zq({file, format: "zjson"})

  const [row1] = ctx.decode(groupBy)
  const accessType = row1.get<TypeValue>("typeof").value

  const rows = ctx.decode(list)
  const accessRecords = rows.filter((r) => r.type === accessType)

  expect(accessRecords.map((r) => r.toString())).toEqual([
    "{info:Access List Example,nets:[10.1.1.0/24,10.1.2.0/24]}"
  ])
})

test("encode decode a field", async () => {
  const input = await zq({query: "*", file, format: "zjson"})
  const ctx = new ZedContext()
  const records = ctx.decode(input)
  expect.assertions(246)

  records.forEach((rec) => {
    rec.flatColumns.forEach((column) => {
      const field = rec.getField(column)
      const after = ctx.decodeField(ctx.encodeField(field))
      expect(field).toEqual(after)
      expect(field.value.type === after.value.type).toBe(true)
    })
  })
})

test("encode decode a typeof value", async () => {
  const input = await zq({
    query: "count() by typeof(this) | sort typeof",
    file,
    format: "zjson"
  })
  const ctx = new ZedContext()
  const records = ctx.decode(input)
  expect.assertions(36)

  records.forEach((rec) => {
    rec.flatColumns.forEach((column) => {
      const field = rec.getField(column)
      const after = ctx.decodeField(ctx.encodeField(field))
      expect(field).toEqual(after)
      expect(field.value.type === after.value.type).toBe(true)
    })
  })
})
