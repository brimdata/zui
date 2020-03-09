/* @flow */
export function url(host: string, path: string) {
  return `http://${host}${path}`
}

export function tryJson(t: string) {
  try {
    return JSON.parse(t)
  } catch (_e) {
    return t
  }
}
