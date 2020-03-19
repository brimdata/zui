/* @flow */
import brim from "../brim"
import lib from "./"

describe("parseInZone", () => {
  let names = lib.date.zoneNames()
  let fmt = "YYYY MM DD HH mm ss SSS"

  let strictDate = "October 31, 2000 11:59pm"
  let referenceDate = "5 minutes ago"
  let casualDate = "Friday"

  test("strict date in all zones", () => {
    names.forEach((zone) => {
      let ts = lib.date.parseInZone(strictDate, zone)
      let str = lib
        .date(brim.time(ts || new Date()).toDate())
        .zone(zone)
        .format(fmt)

      expect(str).toBe("2000 10 31 23 59 00 000")
    })
  })

  test.skip("reference date in all zones", () => {
    names.forEach((zone) => {
      // This is very odd, it does 4 minutes and 30 sec instead of 5
      if (zone === "Africa/Monrovia") return

      let ref = new Date(0)
      let date = lib.date.parseInZone(referenceDate, zone, ref)
      let str = lib
        .date(brim.time(date || new Date()).toDate())
        .zone(zone)
        .format(fmt)

      expect(str).toBe("1969 12 31 15 55 00 000")
    })
  })

  test.skip("casual date in all zones", () => {
    names.forEach((zone) => {
      let ref = new Date(0)
      let date = lib.date.parseInZone(casualDate, zone, ref)
      let str = brim
        .time(date || new Date())
        .toDate()
        .toISOString()

      expect(str).toBe("1970-01-02T20:00:00.000Z")
    })
  })

  test("relative expression remains", () => {
    let result = lib.date.parseInZone("now", "UTC")

    expect(result).toBe("now")
  })

  test("relative with subtraction", () => {
    let result = lib.date.parseInZone("now - 5m", "UTC")

    expect(result).toBe("now - 5m")
  })

  test("invalid relative expression", () => {
    let result = lib.date.parseInZone("nfopfow - 5m", "UTC")

    expect(result).toBe(null)
  })
})
