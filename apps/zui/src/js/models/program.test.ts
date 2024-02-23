/**
 * @jest-environment jsdom
 */

import {createField, createRecord} from "@brimdata/zed-js"
import program, {drillDown, getFilter} from "./program"
import ast from "./ast"
import {SystemTest} from "src/test/system"

new SystemTest("program.test")

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

  test("when there is no leading filter", async () => {
    const script = await drillDown('count() by this["i d"]["orig h"]', result)

    expect(script).toBe('this["i d"]["orig h"]==192.168.0.54')
  })

  test("when there is a sort on there", async () => {
    const script = await drillDown(
      'name=="james" | count() by proto | sort -r count',
      result
    )

    expect(script).toBe('name=="james" | proto=="udp"')
  })

  test("when there is a grep with a star", async () => {
    const script = await drillDown(
      'grep(/(*|Elm)/) Category=="Furnishings" | count() by proto',
      result
    )

    expect(script).toBe(
      'grep(/(*|Elm)/) Category=="Furnishings" | proto=="udp"'
    )
  })

  test("combines keys in the group by proc", async () => {
    const script = await drillDown(
      '_path=="dns" | count() by id.orig_h, proto, query | sort -r',
      result
    )

    expect(script).toBe(
      '_path=="dns" | id.orig_h==192.168.0.54 proto=="udp" query=="WPAD"'
    )
  })

  test("removes *", async () => {
    const script = await drillDown("* | count() by id.orig_h", result)

    expect(script).toBe("id.orig_h==192.168.0.54")
  })

  test("easy peasy", async () => {
    const script = await drillDown("names james | count() by proto", result)

    expect(script).toBe('names james | proto=="udp"')
  })

  test("count by and filter the same", async () => {
    const result = createRecord({md5: "123", count: 1})

    const script = await drillDown(
      'md5=="123" | count() by md5 | sort -r | head 5',
      result
    )

    expect(script).toEqual('md5=="123"')
  })

  test("filter query", async () => {
    const result = createRecord({
      md5: "9f51ef98c42df4430a978e4157c43dd5",
      count: 21,
    })

    const script = await drillDown(
      '_path=="files" filename!="-" | count() by md5,filename | count() by md5 | sort -r | filter count > 1',
      result
    )

    expect(script).toEqual(
      '_path=="files" filename!="-" | md5=="9f51ef98c42df4430a978e4157c43dd5"'
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

jest.setTimeout(30_000)
describe("#hasAnalytics()", () => {
  test("head proc does not have analytics", async () => {
    const tree = await ast("* | head 2")
    expect(tree.hasAnalytics()).toBe(false)
  })

  test("sort proc does not have analytics", async () => {
    const tree = await ast("* | sort -r id.resp_p")
    expect(tree.hasAnalytics()).toBe(false)
  })

  test("every proc does contain analytics", async () => {
    const tree = await ast("* | count() by every(1h)")
    expect(tree.hasAnalytics()).toBe(true)
  })

  test("parallel procs when one does have analytics", async () => {
    const tree = await ast(
      "* | fork ( => count() by every(1h) => count() by id.resp_h )"
    )
    expect(tree.hasAnalytics()).toBe(true)
  })

  test("parallel procs when both do not have analytics", async () => {
    jest.spyOn(global.console, "error").mockImplementation(() => {})
    const tree = await ast("* | head 100; head 200")
    expect(tree.hasAnalytics()).toBe(false)
  })

  test("when there are no procs", async () => {
    const tree = await ast("*")
    expect(tree.hasAnalytics()).toBe(false)
  })

  test("for a crappy string", async () => {
    const tree = await ast("-r")
    expect(tree.hasAnalytics()).toBe(false)
  })

  test("for sequential proc", async () => {
    const tree = await ast("*google* | head 3 | sort -r id.resp_p")
    expect(tree.hasAnalytics()).toBe(false)
  })

  test("for cut proc", async () => {
    const tree = await ast("* | fork ( => cut uid, _path => cut uid ) | tail 1")
    expect(tree.hasAnalytics()).toBe(false)
  })

  test("for filter proc", async () => {
    const tree = await ast('* | filter _path=="conn"')
    expect(tree.hasAnalytics()).toBe(false)
  })
})

describe("extracting the first filter", () => {
  test("*", async () => {
    expect(await getFilter("*")).toEqual("*")
  })

  test('_path=="conn"', async () => {
    expect(await getFilter('_path=="conn"')).toEqual('_path=="conn"')
  })

  test('_path=="conn" | sum(duration)', async () => {
    expect(await getFilter('_path=="conn" | sum(duration)')).toEqual(
      '_path=="conn"'
    )
  })

  test('_path=="conn" | filter a', async () => {
    expect(await getFilter('_path=="conn" | filter a')).toEqual(
      '_path=="conn" | filter a'
    )
  })

  test("count()", async () => {
    expect(await getFilter("count()")).toEqual("*")
  })

  test("dns | count() | filter num > 1", async () => {
    expect(await getFilter("dns | count() | filter num > 1")).toEqual("dns")
  })
})

describe("cut", () => {
  test("cut some fields", async () => {
    const filter = await getFilter("my filter")
    expect(program(filter).cut("ts", "_path").string()).toBe(
      "my filter | cut ts, _path"
    )
  })
})
