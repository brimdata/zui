import time from "src/js/brim/time"
import date from "src/js/lib/date"

export function getTimeString(value: string, zone: string) {
  const result = date.parseInZone(value, zone)
  if (result === null) return "Error parsing date"
  if (typeof result === "string") return result
  if (typeof result === "object") return time(result).toDate().toISOString()
}
