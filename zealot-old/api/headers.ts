const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
}

export default (headers?: Record<string, string>): Headers => {
  return new Headers(Object.assign({}, defaultHeaders, headers))
}
