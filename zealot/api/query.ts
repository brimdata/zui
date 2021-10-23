import newHeaders from "./headers"
import {QueryArgs} from "../types"
import {FetchArgs} from "../fetcher/fetcher"

export default function queryApi(zed: string, args: QueryArgs): FetchArgs {
  return {
    method: "POST",
    path: `/query?${getQueryParams(args)}`,
    body: JSON.stringify({query: zed}),
    headers: getHeaders(args),
    signal: args.signal
  }
}

function getHeaders(args: QueryArgs) {
  let h = newHeaders()

  let format: string
  switch (args.format) {
    case "zng":
      format = "application/x-zng"
      break
    case "ndjson":
      format = "application/x-ndjson"
      break
    case "csv":
      format = "text/csv"
      break
    case "json":
      format = "application/json"
      break
    default:
      format = "application/x-zjson"
  }
  h.set("Accept", format)

  return h
}

function getQueryParams(args: QueryArgs) {
  let p = new URLSearchParams()

  if (args.controlMessages === false) {
    p.set("noctrl", "true")
  }

  return p.toString()
}
