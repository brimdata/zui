/* @flow */

import type {SearchTemplate} from "../types"
import type {Span} from "../../BoomClient/types"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "../../models/searches/programs"
import {parallelizeProcs} from "../../lib/Program"

export function createMd5Search(md5: string, span: Span): SearchTemplate {
  return {
    name: "Md5Search",
    tag: "detail",
    program: parallelizeProcs([
      filenameCorrelation(md5),
      md5Correlation(md5),
      rxHostsCorrelation(md5),
      txHostsCorrelation(md5)
    ]),
    span
  }
}
