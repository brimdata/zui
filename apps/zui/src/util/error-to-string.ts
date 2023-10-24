export function errorToString(e: unknown) {
  if (e === null) return ""

  if (e === undefined) return ""

  if (e instanceof Error) {
    return e.message
  }

  if (typeof e === "string") {
    return e
  }

  if (typeof e === "object") {
    if ("error" in e && typeof e.error == "string") {
      return e.error
    } else if ("message" in e && typeof e.message === "string") {
      return e.message
    }
  }

  if (e && e.toString) return e.toString()

  return JSON.stringify(e)
}
