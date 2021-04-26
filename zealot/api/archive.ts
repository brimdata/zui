import {FetchArgs} from "../fetcher/fetcher"

export type IndexSearchArgs = {
  poolId: string
  patterns: string[]
  index_name?: string
  signal?: AbortSignal
}

export function search({
  poolId,
  index_name,
  patterns,
  signal
}: IndexSearchArgs): FetchArgs {
  return {
    method: "POST",
    path: `/pool/${poolId}/indexsearch?format=ndjson`,
    body: JSON.stringify({index_name, patterns}),
    signal
  }
}
