/* @flow */

import type {ClientOptions} from "../types"

export default (): ClientOptions => ({
  host: null,
  port: null,
  username: "",
  password: "",
  enableCache: true,
  enableIndex: true,
  timeout: 0,
  searchSpan: [new Date(new Date().getTime() - 30 * 60000), new Date()],
  searchSpace: "default",
  searchQueryParams: {},
  adapter: "NodeRequest"
})
