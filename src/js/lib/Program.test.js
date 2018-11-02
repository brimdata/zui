/* @flow */

import * as Program from "./Program"

test("#hasAnalytics head proc does not have analytics", () => {
  expect(Program.hasAnalytics("* | head 2")).toBe(false)
})

test("#hasAnalytics sort proc does not have analytics", () => {
  expect(Program.hasAnalytics("* | sort -r id.resp_p")).toBe(false)
})

test("#hasAnalytics every proc does contain analytics", () => {
  expect(Program.hasAnalytics("* | every 1hr count()")).toBe(true)
})

test("#hasAnalytics parallel procs when one does have analytics", () => {
  expect(
    Program.hasAnalytics("* | every 1hr count(); count() by id.resp_h")
  ).toBe(true)
})

test("#hasAnalytics parallel procs when both do not have analytics", () => {
  expect(Program.hasAnalytics("* | head 100; head 200")).toBe(false)
})

test("#hasAnalytics when there are no procs", () => {
  expect(Program.hasAnalytics("*")).toBe(false)
})

test("#hasAnalytics for a crappy string", () => {
  expect(Program.hasAnalytics("-r")).toBe(false)
})

test("#hasAnalytics for sequential proc", () => {
  expect(Program.hasAnalytics("*google* | head 3 | sort -r id.resp_p")).toBe(
    false
  )
})

test("#addHeadProc when no head exists", () => {
  expect(Program.addHeadProc("_path=dns", 300)).toBe("_path=dns | head 300")
})

test("#addHeadProc when head exists", () => {
  expect(Program.addHeadProc("_path=dns | head 45", 300)).toBe(
    "_path=dns | head 45"
  )
})

test("#addHeadProc when sort exists", () => {
  expect(Program.addHeadProc("_path=dns | sort ts", 300)).toBe(
    "_path=dns | sort ts | head 300"
  )
})

test("#addHeadProc when sort and head exists", () => {
  expect(Program.addHeadProc("_path=dns | head 23 | sort ts", 300)).toBe(
    "_path=dns | head 23 | sort ts"
  )
})
