/* @flow */

import type {Dispatch} from "../../reducers/types"
import {Handler} from "../../BoomClient"
import type {Span} from "../../BoomClient/types"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "./programs"
import {parallelizeProcs} from "../../lib/Program"
import {setCorrelation} from "../../actions/correlations"
import BaseSearch from "./BaseSearch"
import Log from "../Log"
import accumAnalytics from "../../lib/accumAnalytics"

export default class Md5Search extends BaseSearch {
  log: Log

  constructor(log: Log, span: Span) {
    super("BAD DESIGN", span)
    this.log = log
  }

  getProgram() {
    const md5 = this.log.get("md5")
    return parallelizeProcs([
      filenameCorrelation(md5),
      md5Correlation(md5),
      rxHostsCorrelation(md5),
      txHostsCorrelation(md5)
    ])
  }

  receiveData(handler: Handler, dispatch: Dispatch) {
    const key = this.log.id()
    const makeCallback = (name: string) =>
      accumAnalytics((data) => dispatch(setCorrelation(key, name, data)))

    handler
      .channel(0, makeCallback("tx"))
      .channel(1, makeCallback("rx"))
      .channel(2, makeCallback("md5"))
      .channel(3, makeCallback("filenames"))
  }
}
