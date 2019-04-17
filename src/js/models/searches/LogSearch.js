/* @flow */

import throttle from "lodash/throttle"

import type {BoomPayload} from "../../BoomClient/types"
import type {Dispatch} from "../../state/reducers/types"
import {PER_PAGE} from "../../state/reducers/logViewer"
import {accumResults} from "../../lib/accumResults"
import {addHeadProc} from "../../lib/Program"
import {receiveResults} from "../../state/results/actions"
import {setMoreAhead, spliceLogs} from "../../state/actions"
import BaseSearch from "./BaseSearch"
import Handler from "../../BoomClient/lib/Handler"

export default class LogSearch extends BaseSearch {
  getProgram() {
    return addHeadProc(this.program, PER_PAGE)
  }

  receiveData(handler: Handler, dispatch: Dispatch) {
    // Page Receiver
    let count = 0
    handler.each((payload: BoomPayload) => {
      switch (payload.type) {
        case "SearchTuples":
          if (count === 0) dispatch(spliceLogs())
          count += payload.tuples.length
          break
        case "SearchEnd":
          dispatch(setMoreAhead(count >= PER_PAGE))
          break
      }
    })

    // Logs Receiver
    let accum = accumResults()
    let dispatchNow = () => dispatch(receiveResults(accum.results))
    let dispatchSteady = throttle(dispatchNow, 100, {leading: false})

    handler
      .each((payload: BoomPayload) => {
        switch (payload.type) {
          case "SearchDescriptors":
            accum.addDescriptors(payload.descriptors)
            break
          case "SearchTuples":
            accum.addTuples(payload.tuples)
            dispatchSteady()
            break
          case "SearchEnd":
            dispatchSteady.cancel()
            dispatchNow()
            break
        }
      })
      .abort(() => dispatchSteady.cancel())
  }
}
