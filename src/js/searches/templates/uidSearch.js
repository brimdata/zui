/* @flow */

import type {SearchTemplate} from "../types"
import type {Span} from "../../BoomClient/types"

export function createUidSearch(uid: string, span: Span): SearchTemplate {
  return {
    name: "UidSearch",
    tag: "detail",
    program: uid,
    span
  }
}
