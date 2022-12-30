import {zq} from "./cmd/zq"
import {decode, encode, zed, zjson} from "./index"
import {trueType} from "./zed"

const file = "testdata/sample.zson" // data.getPath("sample.zson");

test("super simple", async () => {
  const input: zjson.Object[] = await zq({
    input: '{hello: "world"}',
    format: "zjson",
  })
  const decoded = decode(input)
  const encoded = encode(decoded)
  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i])
  }
})

test("super simple 2 typedefs", async () => {
  const input: zjson.Object[] = await zq({
    input: '{hello: ["world"]}',
    format: "zjson",
  })

  const decoded = decode(input)
  const encoded = encode(decoded)
  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i])
  }
})

test("simply type value", async () => {
  const input: zjson.Object[] = await zq({
    input: "{hello: <string>}",
    format: "zjson",
  })

  const decoded = decode(input)
  const encoded = encode(decoded)
  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i])
  }
})

test("decode, then encode", async () => {
  const input: zjson.Object[] = await zq({file, format: "zjson"})

  const decoded = decode(input)
  const encoded = encode(decoded)

  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i])
  }
})

test("decode, then encode a fused input", async () => {
  const input: zjson.Object[] = await zq({query: "fuse", file, format: "zjson"})

  const decoded = decode(input)
  const encoded = encode(decoded)

  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i])
  }
})

test("decode, encode with type values", async () => {
  const input: zjson.Object[] = await zq({
    query: "* | count() by typeof(this) | sort count, typeof",
    file,
    format: "zjson",
  })

  expect(encode(decode(input))).toEqual(input)
})

test("types from one search are the same", async () => {
  const groupBy = (await zq({
    query: "* | count() by typeof(this) | sort count, typeof",
    file,
    format: "zjson",
  })) as zjson.Object[]
  const list = (await zq({file, format: "zjson"})) as zjson.Object[]

  const [row1] = decode(groupBy) as zed.Record[]
  const accessType = row1.get<zed.TypeValue>("typeof").value

  const rows = decode(list)
  const accessRecords = rows.filter((r) => r.type === accessType)

  expect(accessRecords.map((r) => r.toString())).toEqual([
    "{info:Access List Example,nets:[10.1.1.0/24,10.1.2.0/24]}",
  ])
})

test("encode decode a field", async () => {
  const input: zjson.Object[] = (await zq({
    query: "*",
    file,
    format: "zjson",
  })) as zjson.Object[]

  const records = decode(input) as zed.Record[]
  expect.assertions(242)

  records.forEach((rec) => {
    rec.flatColumns.forEach((column) => {
      const field = rec.getField(column)
      const after = decode(encode(field))
      expect(field).toEqual(after)
      expect(field.value.type === after.value.type).toBe(true)
    })
  })
})

test("encode decode a typeof value", async () => {
  const input: zjson.Object[] = (await zq({
    query: "count() by typeof(this) | sort typeof",
    file,
    format: "zjson",
  })) as zjson.Object[]

  const records = decode(input) as zed.Record[]
  expect.assertions(36)

  records.forEach((rec) => {
    rec.flatColumns.forEach((column) => {
      const field = rec.getField(column)
      const after = decode(encode(field))
      expect(field).toEqual(after)
      expect(field.value.type === after.value.type).toBe(true)
    })
  })
})
