/**
 * @jest-environment jsdom
 */

import {createField, createRecord} from "../../../../../packages/superdb-types/dist"
import program, {drillDown, getFilter} from "./program"
import {SystemTest} from "src/test/system"
import {fetchQueryInfo} from "src/domain/session/handlers"

const system = new SystemTest("program.test")
beforeAll(() => {
  return system.api.pools.create("test")
})

describe("excluding and including", () => {
  const field = createField("uid", "123")

  test("excluding a field", () => {
    const script = program('_path=="weird"').exclude(field).string()
    expect(script).toEqual('_path=="weird" | uid!="123"')
  })

  test("excluding a field with a pipe", () => {
    const script = program(
      'tx_hosts=2606:4700:30::681c:135e fuid!="F2nyqx46YRDAYe4c73" | sort'
    )
      .exclude(createField("source", "HTTP"))
      .string()

    expect(script).toEqual(
      'tx_hosts=2606:4700:30::681c:135e fuid!="F2nyqx46YRDAYe4c73" | sort | source!="HTTP"'
    )
  })

  test("excluding a field with two pipes", () => {
    const script = program('_path=="weird" | sort | filter 1')
      .exclude(field)
      .string()

    expect(script).toEqual('_path=="weird" | sort | filter 1 | uid!="123"')
  })

  test("including a field with two pipes", () => {
    const script = program('_path=="weird" | sort | filter 1')
      .include(field)
      .string()

    expect(script).toEqual('_path=="weird" | sort | filter 1 | uid=="123"')
  })
})

describe("drill down", () => {
  const result = createRecord({
    id: {orig_h: "192.168.0.54"},
    "i d": {"orig h": "192.168.0.54"},
    proto: "udp",
    query: "WPAD",
    count: 24,
  })

  async function run(value: any, text: string) {
    const info = await fetchQueryInfo(text, "test")
    if (info.error) throw new Error(info.error.error)
    const hasAggs = !!info.channels[0].aggregations_keys
    return drillDown(text, value, hasAggs, info.channels[0].aggregation_keys)
  }

  test("when there is no leading filter", async () => {
    const script = await run(result, 'count() by this["i d"]["orig h"]')
    expect(script).toBe('this["i d"]["orig h"]==192.168.0.54')
  })

  test("when there is a sort on there", async () => {
    const script = await run(
      result,
      'name=="james" | count() by proto | sort -r count'
    )

    expect(script).toBe('name=="james" | proto=="udp"')
  })

  test("when there is a grep with a star", async () => {
    const script = await run(
      result,
      'grep(/(*|Elm)/) | Category=="Furnishings" | count() by proto'
    )

    expect(script).toBe(
      'grep(/(*|Elm)/) | Category=="Furnishings" | proto=="udp"'
    )
  })

  test("combines keys in the group by proc", async () => {
    const script = await run(
      result,
      '_path=="dns" | count() by id.orig_h, proto, query | sort -r'
    )

    expect(script).toBe(
      '_path=="dns" | id.orig_h==192.168.0.54 proto=="udp" query=="WPAD"'
    )
  })

  test("easy peasy", async () => {
    const script = await run(result, 'name=="james" | count() by proto')

    expect(script).toBe('name=="james" | proto=="udp"')
  })

  test("count by and filter the same", async () => {
    const result = createRecord({md5: "123", count: 1})

    const script = await run(
      result,
      'md5=="123" | count() by md5 | sort -r | head 5'
    )

    expect(script).toEqual('md5=="123"')
  })

  test("filter query", async () => {
    const result = createRecord({
      md5: "9f51ef98c42df4430a978e4157c43dd5",
      count: 21,
    })

    const script = await run(
      result,
      '_path=="files" | filename!="-" | count() by md5,filename | count() by md5 | sort -r | count > 1'
    )

    expect(script).toEqual(
      '_path=="files" | filename!="-" | md5=="9f51ef98c42df4430a978e4157c43dd5"'
    )
  })
})

describe("count by", () => {
  test("empty program", () => {
    const field = createField("_path", "heyo")
    const script = program().countBy(field.path).string()

    expect(script).toBe("count() by _path")
  })

  test("append a count to an existing query", () => {
    const field = createField("query", "heyo")
    const script = program("dns").countBy(field.path).string()

    expect(script).toBe("dns | count() by query")
  })
})

describe("sort by", () => {
  test("sort asc does not yet exist", () => {
    const script = program("* | count() by _path")
      .sortBy("count", "asc")
      .string()

    expect(script).toBe("* | count() by _path | sort count")
  })

  test("sort desc does not yet exist", () => {
    const script = program("* | count() by _path")
      .sortBy("count", "desc")
      .string()

    expect(script).toBe("* | count() by _path | sort -r count")
  })

  test("sort asc when one already exists", () => {
    const script = program("* | sort name").sortBy("count", "asc").string()

    expect(script).toBe("* | sort count")
  })

  test("sort desc when one already exists", () => {
    const script = program("* | sort name").sortBy("count", "desc").string()

    expect(script).toBe("* | sort -r count")
  })
})

describe("extracting the first filter", () => {
  async function run(text) {
    const info = await fetchQueryInfo(text)
    return getFilter(text, info.isSummarized)
  }

  test("*", async () => {
    expect(await run("*")).toEqual("*")
  })

  test('_path=="conn"', async () => {
    expect(await run('_path=="conn"')).toEqual('_path=="conn"')
  })

  test('_path=="conn" | sum(duration)', async () => {
    expect(await run('_path=="conn" | sum(duration)')).toEqual('_path=="conn"')
  })

  test('_path=="conn" | filter a', async () => {
    expect(await run('_path=="conn" | filter a')).toEqual(
      '_path=="conn" | filter a'
    )
  })

  test("count()", async () => {
    expect(await run("count()")).toEqual("*")
  })

  test("dns | count() | filter num > 1", async () => {
    expect(await run("dns | count() | filter num > 1")).toEqual("dns")
  })

  test("cut some fields", async () => {
    const filter = await run("my filter")
    expect(program(filter).cut("ts", "_path").string()).toBe(
      "my filter | cut ts, _path"
    )
  })
})
