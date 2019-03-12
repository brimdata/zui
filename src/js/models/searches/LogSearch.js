/* @flow */

import type {Dispatch} from "../../reducers/types"
import {Handler} from "../../BoomClient"
import {PER_PAGE} from "../../reducers/logViewer"
import type {Payload} from "../../receivers/types"
import {addHeadProc} from "../../lib/Program"
import {discoverDescriptors} from "../../actions/descriptors"
import {receiveLogTuples, spliceLogs} from "../../actions/logs"
import {setMoreAhead} from "../../actions/logViewer"
import BaseSearch from "./BaseSearch"
import throttle from "lodash/throttle"

export default class LogSearch extends BaseSearch {
  getProgram() {
    return addHeadProc(this.program, PER_PAGE)
  }

  receiveData(handler: Handler, dispatch: Dispatch) {
    // Page Receiver
    let count = 0
    handler.channel(0, (payload: Payload) => {
      switch (payload.type) {
        case "SearchResult":
          if (count === 0) dispatch(spliceLogs())

          count += payload.results.tuples.length
          break
        case "SearchEnd":
          dispatch(setMoreAhead(count >= PER_PAGE))
          break
      }
    })

    // Logs Receiver
    const THROTTLE_DELAY = 100
    let buffer = []

    const dispatchNow = () => {
      if (buffer.length !== 0) {
        dispatch(discoverDescriptors(buffer))
        dispatch(receiveLogTuples(buffer))
        buffer = []
      }
    }

    const dispatchSteady = throttle(dispatchNow, THROTTLE_DELAY, {
      leading: false
    })

    handler
      .channel(0, (payload: Payload) => {
        switch (payload.type) {
          case "SearchEnd":
            dispatchSteady.cancel()
            dispatchNow()
            break
          case "SearchResult":
            if (payload.results.tuples.length) {
              buffer = [...buffer, ...payload.results.tuples]
              dispatchSteady()
            }
            break
        }
      })
      .abort(() => dispatchSteady.cancel())
  }
}
