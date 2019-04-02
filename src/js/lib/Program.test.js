/* @flow */

import {
  addHeadProc,
  getHeadCount,
  hasAnalytics,
  hasHeadOrTailProc,
  joinParts,
  parallelizeProcs,
  splitParts
} from "./Program"

describe("#hasAnalytics", () => {
  test("head proc does not have analytics", () => {
    expect(hasAnalytics("* | head 2")).toBe(false)
  })

  test("sort proc does not have analytics", () => {
    expect(hasAnalytics("* | sort -r id.resp_p")).toBe(false)
  })

  test("every proc does contain analytics", () => {
    expect(hasAnalytics("* | every 1hr count()")).toBe(true)
  })

  test("parallel procs when one does have analytics", () => {
    expect(hasAnalytics("* | every 1hr count(); count() by id.resp_h")).toBe(
      true
    )
  })

  test("parallel procs when both do not have analytics", () => {
    expect(hasAnalytics("* | head 100; head 200")).toBe(false)
  })

  test("when there are no procs", () => {
    expect(hasAnalytics("*")).toBe(false)
  })

  test("for a crappy string", () => {
    expect(hasAnalytics("-r")).toBe(false)
  })

  test("for sequential proc", () => {
    expect(hasAnalytics("*google* | head 3 | sort -r id.resp_p")).toBe(false)
  })

  test("for cut proc", () => {
    expect(hasAnalytics("* | (cut uid, _path; cut uid) | tail 1")).toBe(true)
  })

  test("for filter proc", () => {
    expect(hasAnalytics("* | filter _path=conn")).toBe(false)
  })
})

describe("#addHeadProc", () => {
  test("when no head exists", () => {
    expect(addHeadProc("_path=dns", 300)).toBe("_path=dns | head 300")
  })

  test("when head exists", () => {
    expect(addHeadProc("_path=dns | head 45", 300)).toBe("_path=dns | head 45")
  })

  test("when sort exists", () => {
    expect(addHeadProc("_path=dns | sort ts", 300)).toBe(
      "_path=dns | sort ts | head 300"
    )
  })

  test("when sort and head exists", () => {
    expect(addHeadProc("_path=dns | head 23 | sort ts", 300)).toBe(
      "_path=dns | head 23 | sort ts"
    )
  })
})

describe("#getHeadCount", () => {
  test("with one head proc", () => {
    expect(getHeadCount("* | head 1000")).toBe(1000)
  })

  test("with many procs", () => {
    expect(getHeadCount("* | head 1000; count()")).toBe(1000)
  })

  test("with no head", () => {
    expect(getHeadCount("*")).toBe(0)
  })
})

describe("#hasHeadCount", () => {
  test("#hasHeadCount when false", () => {
    expect(hasHeadOrTailProc("*")).toBe(false)
  })

  test("#hasHeadCount when true", () => {
    expect(hasHeadOrTailProc("* | head 1")).toBe(true)
  })
})

describe("Get Parts of Program", () => {
  let program = "md5=123 _path=files | count() by md5 | sort -r | head 1"

  test("get filter part", () => {
    expect(splitParts(program)[0]).toBe("md5=123 _path=files")
  })

  test("get filter part when none", () => {
    expect(splitParts("* | count()")[0]).toBe("*")
  })

  test("get proc part", () => {
    expect(splitParts(program)[1]).toBe("count() by md5 | sort -r | head 1")
  })

  test("get proc part when none", () => {
    expect(splitParts("_path=files")[1]).toEqual("")
  })
})

describe("Join Parts of Program", () => {
  let filter = "md5=123"
  let proc = "count() by _path"

  test("#joinParts", () => {
    expect(joinParts(filter, proc)).toBe("md5=123 | count() by _path")
  })

  test("#joinParts when empty filter", () => {
    expect(joinParts("", proc)).toBe("* | count() by _path")
  })
})

describe("Parallelizing multiple programs", () => {
  let a = "md5=123 | count()"
  let b = "md5=123 | head 5"
  let c = "md5=123 | count() by _path"

  test("#parallelizeProcs when programs have same filter", () => {
    expect(parallelizeProcs([a, b, c])).toEqual(
      "md5=123 | count(); head 5; count() by _path"
    )
  })

  test("#parallelizeProcs when programs do no have same filter", () => {
    expect(() => {
      parallelizeProcs([a, b, c, "_path=conn"])
    }).toThrow(
      "Filters must be the same in all programs: md5=123, md5=123, md5=123, _path=conn"
    )
  })
})
