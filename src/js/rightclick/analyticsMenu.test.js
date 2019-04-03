/* @flow */
import {analyticsMenu} from "./analyticsMenu"
import {conn} from "../test/mockLogs"

describe("Analysis Right Click", () => {
  const program = "* | count()"

  test("address field", () => {
    const log = conn()
    const field = log.getField("id.orig_h")
    const menu = analyticsMenu(program)(field, log)

    expect(menu).toMatchSnapshot()
  })

  test("non-address field", () => {
    const log = conn()
    const field = log.getField("proto")
    const menu = analyticsMenu(program)(field, log)

    expect(menu).toMatchSnapshot()
  })

  test("group by proc", () => {
    const log = conn()
    const field = log.getField("proto")
    const menu = analyticsMenu(program)(field, log)

    expect(menu).toMatchSnapshot()
  })
})
