import brim from "src/js/brim"
import {withCommas} from "src/js/lib/fmt"
import {zed} from "zealot"

export function formatPrimitive(data: zed.Primitive) {
  if (data.isUnset()) return "⦻"
  if (zed.isNamed(data.type, "port")) return data.toString()
  if (zed.isInt(data)) return withCommas(data.toString())
  if (zed.isTime(data)) return brim.time(data.toDate()).format()
  return data.toString()
}
