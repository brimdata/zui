/* @flow */
export default function normalizePayload(payload: Object) {
  if (payload instanceof File) {
    return payload
  } else if (typeof payload === "object") {
    return JSON.stringify(payload)
  } else {
    return payload
  }
}
