import {isObject, isString} from "lodash"

export function isAbortError(e: unknown) {
  if (isObject(e)) {
    if ("name" in e && e.name === "AbortError") return true
    if (
      "message" in e &&
      isString(e.message) &&
      e.message.match(/user aborted/)
    )
      return true
  }
  return false
}
