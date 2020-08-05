import ZQL from "../../node_modules/zq/zql/zql.es.js";
import { createSpan } from "../util/span.ts";
import { SearchArgs } from "../types.ts";
import { FetchArgs } from "../fetcher/fetcher.ts";

export type IndexSearchArgs = {
  spaceId: string,
  index_name: string,
  patterns: string[],
  signal?: AbortSignal,
}

export function search({spaceId, index_name, patterns, signal}: IndexSearchArgs): FetchArgs {
  return {
    method: "POST",
    path: `/space/${spaceId}/indexsearch?format=ndjson`,
    body: JSON.stringify({index_name, patterns}),
    signal
  };
}
