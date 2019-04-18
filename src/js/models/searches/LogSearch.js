/* @flow */

import throttle from "lodash/throttle"

import type {BoomPayload} from "../../BoomClient/types"
import type {Dispatch} from "../../state/reducers/types"
import {PER_PAGE} from "../../state/reducers/logViewer"
import {accumTupleSet} from "../../lib/accumResults"
import {addHeadProc} from "../../lib/Program"
import {appendResults, resultsComplete} from "../../state/results/actions"
import BaseSearch from "./BaseSearch"
import Handler from "../../BoomClient/lib/Handler"
import Log from "../Log"

export default class LogSearch extends BaseSearch {
  getProgram() {
    return addHeadProc(this.program, PER_PAGE)
  }

  receiveData(handler: Handler, dispatch: Dispatch) {
    let count = 0
    let accum = accumTupleSet()

    function dispatchNow() {
      let logs = Log.fromTupleSet(accum.results)
      if (logs.length) dispatch(appendResults(logs))
      accum.clear()
    }

    let dispatchSteady = throttle(dispatchNow, 100, {leading: false})

    handler
      .each((payload: BoomPayload) => {
        switch (payload.type) {
          case "SearchDescriptors":
            accum.addDescriptors(payload.descriptors)
            break
          case "SearchTuples":
            accum.addTuples(payload.tuples)
            count += payload.tuples.length
            dispatchSteady()
            break
          case "SearchEnd":
            dispatchSteady.cancel()
            dispatchNow()
            if (count < PER_PAGE) dispatch(resultsComplete())
            break
        }
      })
      .abort(() => dispatchSteady.cancel())
  }
}
