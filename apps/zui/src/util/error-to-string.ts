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
      if ("details" in e && Array.isArray(e.details)) {
        return [e.message, ...e.details].join("\n")
      }
      return e.message
    }
  }

  if (e && e.toString) return e.toString()

  return JSON.stringify(e)
}
