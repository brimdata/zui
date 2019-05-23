/* @flow */
import {isEqual} from "lodash"

import type {Finding} from "../state/reducers/investigation"

export function getKey(finding: Finding) {
  return finding.ts.getTime().toString()
}

export function sameSpan(a: Finding, b: ?Finding) {
  if (!b) return false
  return isEqual(a.search.span, b.search.span)
}
