import ZQL from "../../node_modules/zq/zql/zql.es.js";
import { createSpan } from "../util/span.ts";
import { SearchArgs } from "../types.ts";
import { FetchArgs } from "../fetcher/fetcher.ts";

export default function searchApi(zql: string, args: SearchArgs): FetchArgs {
  return {
    method: "POST",
    path: `/search?${getQueryParams(args)}`,
    body: JSON.stringify(getSearchBody(zql, args)),
    enhancers: args.enhancers || [],
    signal: args.signal,
  };
}

function getQueryParams(args: SearchArgs) {
  let p = new URLSearchParams();
  p.set("format", args.format);

  if (args.controlMessages === false) {
    p.set("noctrl", "true");
  }

  return p.toString();
}

export function getSearchBody(
  zql: string,
  { spaceId, from, to }: SearchArgs,
) {
  const proc = ZQL.parse(zql);
  const span = createSpan(from, to);

  return {
    proc,
    span,
    space: spaceId,
    dir: -1,
  };
}
