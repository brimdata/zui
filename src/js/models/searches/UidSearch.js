/* @flow */

import type {Dispatch} from "../../state/reducers/types"
import type {Span} from "../../BoomClient/types"
import type {Tuple} from "../../types"
import {addHeadProc} from "../../lib/Program"
import {discoverDescriptors} from "../../state/thunks/descriptors"
import {setCorrelation} from "../../state/actions"
import BaseSearch from "./BaseSearch"
import Handler from "../../BoomClient/lib/Handler"
import Log from "../Log"

export default class UidSearch extends BaseSearch {
  log: Log

  constructor(log: Log, span: Span) {
    super(log.correlationId(), span)
    this.log = log
  }

  getProgram() {
    return addHeadProc(this.program, 500)
  }

  receiveData(handler: Handler, dispatch: Dispatch) {
    let data: Tuple[] = []
    const key = this.log.id()

    handler
      .channel(0, ({type, results}) => {
        if (type === "SearchResult") {
          data = [...data, ...results.tuples]
          dispatch(setCorrelation(key, "uid", data))
          dispatch(discoverDescriptors(results.tuples))
        }
      })
      .error(console.error)
  }
}
