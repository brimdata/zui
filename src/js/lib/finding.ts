
import { isEqual } from "lodash";

import { Finding } from "../state/Investigation/types";

export function getKey(finding: Finding) {
  let {
    sec,
    ns
  } = finding.ts;
  return `${sec}.${ns}`;
}

export function sameSpan(a: Finding, b: Finding | null | undefined) {
  if (!b) return false;
  return isEqual(a.search.spanArgs, b.search.spanArgs);
}