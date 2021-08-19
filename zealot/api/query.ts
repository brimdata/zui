import {QueryArgs} from "../types"
import {FetchArgs} from "../fetcher/fetcher"

export default function queryApi(zql: string, args: QueryArgs): FetchArgs {
  return {
    method: "POST",
    path: `/query?${getQueryParams(args)}`,
    body: JSON.stringify({query: zql}),
    headers: getHeaders(args)
  }
}

function getHeaders(args: QueryArgs) {
  let h = new Headers()

  let format
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
