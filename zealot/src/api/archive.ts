import {FetchArgs} from "../fetcher/fetcher"

export type IndexSearchArgs = {
  spaceId: string
  patterns: string[]
  index_name?: string
  signal?: AbortSignal
}

export function search({
  spaceId,
  index_name,
  patterns,
  signal
}: IndexSearchArgs): FetchArgs {
  return {
    method: "POST",
    path: `/space/${spaceId}/indexsearch?format=ndjson`,
    body: JSON.stringify({index_name, patterns}),
    signal
  }
}
