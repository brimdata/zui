import {createField, createRecord} from "src/test/shared/factories/zed-factory"
import {joinParts, parallelizeProcs, splitParts} from "../lib/Program"
import program from "./program"

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

  test("when there is no leading filter", () => {
    const script = program('count() by this["i d"]["orig h"]')
      .drillDown(result)
      .string()

    expect(script).toBe('this["i d"]["orig h"]==192.168.0.54')
  })

  test("when there is a sort on there", () => {
    const script = program('name=="james" | count() by proto | sort -r count')
      .drillDown(result)
      .string()

    expect(script).toBe('name=="james" | proto=="udp"')
  })

  test("when there is a grep with a star", () => {
    const script = program(
      'grep(/(*|Elm)/) Category=="Furnishings" | count() by proto'
    )
      .drillDown(result)
      .string()

    expect(script).toBe(
      'grep(/(*|Elm)/) Category=="Furnishings" | proto=="udp"'
    )
  })

  test("combines keys in the group by proc", () => {
    const script = program(
      '_path=="dns" | count() by id.orig_h, proto, query | sort -r'
    )
      .drillDown(result)
      .string()

    expect(script).toBe(
      '_path=="dns" | id.orig_h==192.168.0.54 proto=="udp" query=="WPAD"'
    )
  })

  test("removes *", () => {
    const script = program("* | count() by id.orig_h")
      .drillDown(result)
      .string()

    expect(script).toBe("id.orig_h==192.168.0.54")
  })

  test("easy peasy", () => {
    const script = program("names james | count() by proto")
      .drillDown(result)
      .string()

    expect(script).toBe('names james | proto=="udp"')
  })

  test("count by and filter the same", () => {
    const result = createRecord({md5: "123", count: 1})

    const script = program('md5=="123" | count() by md5 | sort -r | head 5')
      .drillDown(result)
      .string()

    expect(script).toEqual('md5=="123"')
  })

  test("filter query", () => {
    const result = createRecord({
      md5: "9f51ef98c42df4430a978e4157c43dd5",
      count: 21,
    })

    const script = program(
      '_path=="files" filename!="-" | count() by md5,filename | count() by md5 | sort -r | filter count > 1'
    )
      .drillDown(result)
      .string()

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

describe("#hasAnalytics()", () => {
  test("head proc does not have analytics", () => {
    expect(program("* | head 2").hasAnalytics()).toBe(false)
  })

  test("sort proc does not have analytics", () => {
    expect(program("* | sort -r id.resp_p").hasAnalytics()).toBe(false)
  })

  test("every proc does contain analytics", () => {
    expect(program("* | count() by every(1h)").hasAnalytics()).toBe(true)
  })

  test("parallel procs when one does have analytics", () => {
    expect(
      program(
        "* | fork ( => count() by every(1h) => count() by id.resp_h )"
      ).hasAnalytics()
    ).toBe(true)
  })

  test("parallel procs when both do not have analytics", () => {
    expect(program("* | head 100; head 200").hasAnalytics()).toBe(false)
  })

  test("when there are no procs", () => {
    expect(program("*").hasAnalytics()).toBe(false)
  })

  test("for a crappy string", () => {
    expect(program("-r").hasAnalytics()).toBe(false)
  })

  test("for sequential proc", () => {
    expect(
      program("*google* | head 3 | sort -r id.resp_p").hasAnalytics()
    ).toBe(false)
  })

  test("for cut proc", () => {
    expect(
      program(
        "* | fork ( => cut uid, _path => cut uid ) | tail 1"
      ).hasAnalytics()
    ).toBe(false)
  })

  test("for filter proc", () => {
    expect(program('* | filter _path=="conn"').hasAnalytics()).toBe(false)
  })
})

describe("Get Parts of Program", () => {
  const script = 'md5=="123" _path=="files" | count() by md5 | sort -r | head 1'

  test("get filter part", () => {
    expect(splitParts(script)[0]).toBe('md5=="123" _path=="files"')
  })

  test("get filter part when none", () => {
    expect(splitParts("* | count()")[0]).toBe("*")
  })

  test("get proc part", () => {
    expect(splitParts(script)[1]).toBe("count() by md5 | sort -r | head 1")
  })

  test("get proc part when none", () => {
    expect(splitParts('_path=="files"')[1]).toEqual("")
  })
})

describe("Join Parts of Program", () => {
  const filter = 'md5=="123"'
  const proc = "count() by _path"

  test("#joinParts", () => {
    expect(joinParts(filter, proc)).toBe('md5=="123" | count() by _path')
  })

  test("#joinParts when empty filter", () => {
    expect(joinParts("", proc)).toBe("* | count() by _path")
  })
})

describe("Parallelizing multiple programs", () => {
  const a = 'md5=="123" | count()'
  const b = 'md5=="123" | head 5'
  const c = 'md5=="123" | count() by _path'

  test("#parallelizeProcs when programs have same filter", () => {
    expect(parallelizeProcs([a, b, c])).toEqual(
      'md5=="123" | fork ( => count() => head 5 => count() by _path )'
    )
  })

  test("#parallelizeProcs when programs do not have same filter", () => {
    expect(() => {
      parallelizeProcs([a, b, c, '_path=="conn"'])
    }).toThrow(
      'Filters must be the same in all programs: md5=="123", md5=="123", md5=="123", _path=="conn"'
    )
  })
})

describe("extracting the first filter", () => {
  test("*", () => {
    expect(program("*").filter()).toEqual("*")
  })

  test('_path=="conn"', () => {
    expect(program('_path=="conn"').filter()).toEqual('_path=="conn"')
  })

  test('_path=="conn" | sum(duration)', () => {
    expect(program('_path=="conn" | sum(duration)').filter()).toEqual(
      '_path=="conn"'
    )
  })

  test('_path=="conn" | filter a', () => {
    expect(program('_path=="conn" | filter a').filter()).toEqual(
      '_path=="conn" | filter a'
    )
  })

  test("count()", () => {
    expect(program("count()").filter()).toEqual("*")
  })

  test("dns | count() | filter num > 1", () => {
    expect(program("dns | count() | filter num > 1").filter()).toEqual("dns")
  })
})

describe("cut", () => {
  test("cut some fields", () => {
    expect(program("my filter").cut("ts", "_path").string()).toBe(
      "my filter | cut ts, _path"
    )
  })
})
