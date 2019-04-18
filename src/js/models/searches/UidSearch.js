/* @flow */

import type {BoomPayload, Span} from "../../BoomClient/types"
import type {Dispatch} from "../../state/reducers/types"
import type {Tuple} from "../../types"
import {accumTupleSet} from "../../lib/accumResults"
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
    const key = this.log.id()
    let accum = accumTupleSet()

    handler
      .each((payload: BoomPayload) => {
        switch (payload.type) {
          case "SearchDescriptors":
            accum.addDescriptors(payload.descriptors)
            break
          case "SearchTuples":
            accum.addTuples(payload.tuples)
            dispatch(
              setCorrelation(key, "uid", Log.fromTupleSet(accum.getTupleSet()))
            )
            break
        }
      })
      .error(console.error)
  }
}
