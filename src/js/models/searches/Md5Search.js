/* @flow */

import type {BoomPayload, Span} from "../../BoomClient/types"
import type {Dispatch} from "../../state/reducers/types"
import {accumTupleSet} from "../../lib/accumResults"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "./programs"
import {parallelizeProcs} from "../../lib/Program"
import {setCorrelation} from "../../state/actions"
import BaseSearch from "./BaseSearch"
import Handler from "../../BoomClient/lib/Handler"
import Log from "../Log"

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
    let key = this.log.id()
    let accum = accumTupleSet()

    function getCorrelationName(channel) {
      switch (channel) {
        case 0:
          return "tx"
        case 1:
          return "rx"
        case 2:
          return "md5"
        case 3:
          return "filenames"
        default:
          throw "Unknown Channel"
      }
    }

    function dispatchCorrelation(channel: number) {
      let name = getCorrelationName(channel)
      let tupleSet = accum.getTupleSet(channel)
      dispatch(setCorrelation(key, name, Log.fromTupleSet(tupleSet)))
    }

    handler.each((payload: BoomPayload) => {
      switch (payload.type) {
        case "SearchDescriptors":
          accum.addDescriptors(payload.descriptors)
          break
        case "SearchTuples":
          accum.addTuples(payload.tuples, payload.channel_id)
          dispatchCorrelation(payload.channel_id)
          break
      }
    })
  }
}
