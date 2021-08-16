import {QueryArgs} from "../types"
import {FetchArgs} from "../fetcher/fetcher"

export default function queryApi(zql: string, args: QueryArgs): FetchArgs {
  return {
    method: "POST",
    path: `/query?${getQueryParams(args)}`,
    body: JSON.stringify({query: zql})
  }
}

function getQueryParams(args: QueryArgs) {
  let p = new URLSearchParams()
  p.set("format", args.format)

  if (args.controlMessages === false) {
    p.set("noctrl", "true")
  }

  return p.toString()
}
