/* @flow */
import isEmpty from "lodash/isEmpty"

export default (
  host: string,
  port: number,
  path: string,
  query: Object = {}
) => {
  const url = `http://${host}:${port}${path}`

  if (isEmpty(query)) return url

  const params = new URLSearchParams()

  for (let key in query) params.set(key, query[key])

  return `${url}?${params.toString()}`
}
