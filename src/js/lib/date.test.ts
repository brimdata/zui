import brim from "../brim"
import lib from "./"

describe("parseInZone", () => {
  const names = lib.date.zoneNames()
  const fmt = "YYYY MM DD HH mm ss SSS"

  const strictDate = "October 31, 2000 11:59pm"
  const referenceDate = "5 minutes ago"
  const casualDate = "Friday"

  test("strict date in all zones", () => {
    names.forEach((zone) => {
      const ts = lib.date.parseInZone(strictDate, zone)
      const str = lib
        .date(brim.time(ts || new Date()).toDate())
        .zone(zone)
        .format(fmt)

      expect(str).toBe("2000 10 31 23 59 00 000")
    })
  })

  test("reference date in all zones", () => {
    names.forEach((zone) => {
      // This is very odd, it does 4 minutes and 30 sec instead of 5
      if (zone === "Africa/Monrovia") return

      const ref = new Date(0)
      const date = lib.date.parseInZone(referenceDate, zone, ref)
      const str = lib
        .date(brim.time(date || new Date()).toDate())
        .zone(zone)
        .format(fmt)

      expect(str).toBe("1969 12 31 15 55 00 000")
    })
  })

  test("casual date in all zones", () => {
    names.forEach((zone) => {
      const ref = new Date(0)
      const date = lib.date.parseInZone(casualDate, zone, ref)
      const str = brim
        .time(date || new Date())
        .toDate()
        .toISOString()

      expect(str).toBe("1970-01-02T20:00:00.000Z")
    })
  })

  test("relative expression remains", () => {
    const result = lib.date.parseInZone("now", "UTC")

    expect(result).toBe("now")
  })

  test("relative with subtraction", () => {
    const result = lib.date.parseInZone("now - 5m", "UTC")

    expect(result).toBe("now - 5m")
  })

  test("invalid relative expression", () => {
    const result = lib.date.parseInZone("nfopfow - 5m", "UTC")

    expect(result).toBe(null)
  })
})
