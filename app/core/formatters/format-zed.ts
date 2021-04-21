import brim from "src/js/brim"
import {withCommas} from "src/js/lib/fmt"
import {ZedPrimitive} from "zealot/zed"

export function formatPrimitive(data: ZedPrimitive) {
  if (data.isUnset()) return "⦻"
  if (data.type.match(/int/)) return withCommas(data.toString())
  if (data.type === "time") return brim.time(this.toDate()).format()
  return data.toString()
}
